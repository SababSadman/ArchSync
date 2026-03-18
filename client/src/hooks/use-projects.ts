import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Project, CreateProjectInput } from '../types/project';

export function useProjects(filters?: { status?: string; phase?: string; search?: string }, sort?: { by: string; order: 'asc' | 'desc' }) {
  return useQuery({
    queryKey: ['projects', filters, sort],
    queryFn: async () => {
      // 1. Get current user's organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let organizationId = user.user_metadata?.organization_id;

      // 2. Query projects for this organization
      let query = supabase.from('projects').select('*').eq('organization_id', organizationId);

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

      // Resolve or create organization_id
      let organizationId = user.user_metadata?.organization_id;

      if (!organizationId || organizationId === '00000000-0000-0000-0000-000000000000') {
        console.log('[CreateProject] No valid organization_id in metadata. Checking database...');
        
        // Try to find any organization where the user is a member
        const { data: orgs, error: orgError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .limit(1);

        if (orgError) {
          console.error('[CreateProject] Error checking organizations:', orgError);
        }

        if (orgs && orgs.length > 0) {
          organizationId = orgs[0].organization_id;
          console.log('[CreateProject] Found existing organization via membership:', organizationId);
        } else {
          // Create a default organization if none exists
          console.log('[CreateProject] No organizations found. Creating default...');
          const { data: newOrg, error: createOrgError } = await supabase
            .from('organizations')
            .insert([{ 
              name: 'Personal Studio',
              slug: `studio-${user.id.slice(0, 8)}`, // Unique, URL-safe slug
              created_by: user.id                    // Required FK
            }])
            .select()
            .single();

          if (createOrgError) {
            console.error('[CreateProject] Failed to create default organization:', createOrgError);
            throw new Error(`Failed to create organization: ${createOrgError.message}`);
          }

          organizationId = newOrg.id;
          console.log('[CreateProject] Created new default organization:', organizationId);

          // Auto-add user as organization owner
          const { error: memberError } = await supabase
            .from('organization_members')
            .insert([{
              organization_id: organizationId,
              user_id: user.id,
              role: 'owner',
              joined_at: new Date().toISOString()
            }]);

          if (memberError) {
            console.error('[CreateProject] Failed to add user as org owner:', memberError);
            // We proceed anyway as the org exists, but this is a warning sign
          }
          
          // Proactively update user metadata so future projects use this ID
          await supabase.auth.updateUser({
            data: { organization_id: organizationId }
          });
        }
      }
      
      console.log('[CreateProject] Using Organization ID:', organizationId);

      // Prepare project data
      const projectData = {
        ...newProject,
        created_by: user.id,
        organization_id: organizationId,
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

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      console.log('[DeleteProject] Attempting delete for ID:', projectId);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('[DeleteProject Error]', error);
        throw error;
      }
      return projectId;
    },
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);
      
      // Optimistic update
      queryClient.setQueryData(['projects'], (old: Project[] | undefined) => {
        return old?.filter(p => p.id !== projectId);
      });

      return { previousProjects };
    },
    onError: (err, projectId, context) => {
      console.error('[DeleteProject] Mutation failed, rolling back:', err);
      queryClient.setQueryData(['projects'], context?.previousProjects);
    },
    onSuccess: () => {
      console.log('[DeleteProject] Mutation successful');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
