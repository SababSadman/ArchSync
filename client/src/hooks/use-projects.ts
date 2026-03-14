import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Project, CreateProjectInput } from '../types/project';

export function useProjects(filters?: { status?: string; phase?: string; search?: string }, sort?: { by: string; order: 'asc' | 'desc' }) {
  return useQuery({
    queryKey: ['projects', filters, sort],
    queryFn: async () => {
      let query = supabase.from('projects').select('*');

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.phase && filters.phase !== 'all') {
        query = query.eq('phase', filters.phase);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (sort) {
        query = query.order(sort.by, { ascending: sort.order === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: CreateProjectInput) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);
      
      // Optimistic update
      queryClient.setQueryData(['projects'], (old: Project[] | undefined) => [
        ...(old || []),
        { 
          ...newProject, 
          id: 'temp-' + Date.now(), 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization_id: 'temp-org', // Should be replaced by actual org context
          created_by: 'temp-user', // Should be replaced by actual user context
        } as Project
      ]);

      return { previousProjects };
    },
    onError: (err, newProject, context) => {
      queryClient.setQueryData(['projects'], context?.previousProjects);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
