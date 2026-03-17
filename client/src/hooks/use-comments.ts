import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Comment {
  id: string;
  file_id: string;
  parent_id: string | null;
  content: string;
  x_percent: number | null;
  y_percent: number | null;
  status: 'open' | 'in_progress' | 'resolved' | 'needs_action';
  is_client_visible: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url: string;
  };
}

export function useComments(file_id: string) {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', file_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:users!comments_created_by_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('file_id', file_id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!file_id,
  });

  useEffect(() => {
    if (!file_id) return;

    const channel = supabase
      .channel(`comments:${file_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `file_id=eq.${file_id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['comments', file_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [file_id, queryClient]);

  return { comments, isLoading };
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: Partial<Comment>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert([{ 
          ...newComment, 
          created_by: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Handle mentions separately if any in content
      const mentions = newComment.content?.match(/@\[([^\]]+)\]\(([^)]+)\)/g) || [];
      if (mentions.length > 0) {
        const mentionUsers = mentions.map(m => m.match(/\(([^)]+)\)/)?.[1]);
        await supabase.from('comment_mentions').insert(
          mentionUsers.map(userId => ({
            comment_id: data.id,
            user_id: userId
          }))
        );
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.file_id] });
    },
  });
}

export function useUpdateCommentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, file_id }: { id: string, status: Comment['status'], file_id: string }) => {
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.file_id] });
    },
  });
}
