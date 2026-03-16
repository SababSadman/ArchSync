import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { FileRecord } from '../types/file';

export function useProjectFiles(projectId: string) {
  return useQuery<FileRecord[]>({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select(`
          id, name, storage_path, mime_type, size_bytes, project_id, uploaded_by, phase, created_at, updated_at,
          uploader:users!uploaded_by(full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data as any[]).map(file => ({
        ...file,
        uploader: Array.isArray(file.uploader) ? file.uploader[0] : file.uploader
      })) as FileRecord[];
    },
    enabled: !!projectId,
  });
}
