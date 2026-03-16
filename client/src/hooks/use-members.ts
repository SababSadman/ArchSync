import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'viewer' | 'editor' | 'lead' | 'architect' | 'client' | 'consultant';
  joined_at: string;
  profile?: {
    full_name: string;
    avatar_url: string;
    email: string;
  };
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ['project_members', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          *,
          profile:profiles!project_members_user_id_fkey (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('project_id', projectId);

      if (error) {
        // If table doesn't exist yet, return empty array instead of crashing
        if (error.code === 'PGRST116' || error.message.includes('relation "project_members" does not exist')) {
          console.warn('project_members table not found. Returning empty list.');
          return [];
        }
        throw error;
      }
      return data as ProjectMember[];
    },
    enabled: !!projectId,
  });
}

export function useAddProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, email, role }: { projectId: string; email: string; role: ProjectMember['role'] }) => {
      // 1. Find user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        throw new Error(`User with email ${email} not found.`);
      }

      // 2. Add as project member
      const { data, error } = await supabase
        .from('project_members')
        .insert([{
          project_id: projectId,
          user_id: profile.id,
          role
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project_members', variables.projectId] });
    },
  });
}

export function useRemoveProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

      if (error) throw error;
      return userId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project_members', variables.projectId] });
    },
  });
}
