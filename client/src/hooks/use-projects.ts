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
      // Get real user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to create projects');

      // Prepare project data
      const projectData = {
        ...newProject,
        created_by: user.id,
        // Using a valid-looking UUID placeholder if none exists
        organization_id: user.user_metadata?.organization_id || '00000000-0000-0000-0000-000000000000',
        cover_image_url: null,
      };

      console.log('[CreateProject] Attempting insert:', projectData);

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error('[CreateProject Error]', error);
        throw error;
      }
      return data as Project;
    },
    onMutate: async (newProject) => {
      console.log('[CreateProject] Mutation started:', newProject);
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);
      
      // Optimistic update
      queryClient.setQueryData(['projects'], (old: Project[] | undefined) => {
        const optimisticProject = { 
          ...newProject, 
          id: '00000000-0000-0000-0000-' + Date.now(), 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization_id: '00000000-0000-0000-0000-000000000000',
          created_by: '00000000-0000-0000-0000-000000000000', // Better placeholder
          cover_image_url: null,
        } as Project;
        console.log('[CreateProject] Adding optimistic project:', optimisticProject);
        return [...(old || []), optimisticProject];
      });

      return { previousProjects };
    },
    onError: (err, newProject, context) => {
      console.error('[CreateProject] Mutation failed, rolling back:', err);
      queryClient.setQueryData(['projects'], context?.previousProjects);
    },
    onSuccess: (data) => {
      console.log('[CreateProject] Mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
