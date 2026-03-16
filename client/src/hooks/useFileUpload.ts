import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UploadState } from '../types/file';
import { useQueryClient } from '@tanstack/react-query';

export const useFileUpload = (projectId: string, orgId: string) => {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadFile = useCallback(async (file: File) => {
    const timestamp = Date.now();
    const storagePath = `${orgId}/${projectId}/${timestamp}_${file.name}`;
    
    const newUpload: UploadState = {
      file,
      progress: 0,
      status: 'uploading',
    };

    setUploads((prev) => [...prev, newUpload]);
    setIsUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('project-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          // Progress is tricky with supabase-js simple upload, 
          // but we can simulate it for better UX if needed, 
          // or use the standard upload which doesn't expose it easily.
          // For this implementation, we'll focus on the flow.
        });

      if (storageError) throw storageError;

      // 2. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 3. Check if file record already exists (optional, based on name/path logic)
      // For simplicity, we create a new file record as per prompt's "insert into files table"
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          storage_path: storagePath,
          file_type: file.name.split('.').pop() || 'unknown',
          file_size: file.size,
          project_id: projectId,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (fileError) throw fileError;

      // 4. Insert into file_versions table
      const { error: versionError } = await supabase
        .from('file_versions')
        .insert({
          file_id: fileData.id,
          storage_path: storagePath,
          version_number: 1, // Start at 1 as per prompt
          file_size: file.size,
          uploaded_by: user.id,
        });

      if (versionError) throw versionError;

      // Update state to completed
      setUploads((prev) =>
        prev.map((up) =>
          up.file === file ? { ...up, progress: 100, status: 'completed' } : up
        )
      );
      
      // Invalidate queries to refresh file list
      queryClient.invalidateQueries({ queryKey: ['files', projectId] });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setUploads((prev) =>
        prev.map((up) =>
          up.file === file ? { ...up, status: 'error', error: errorMessage } : up
        )
      );
    } finally {
      // Check if any uploads are still in progress
      setUploads((prev) => {
        const stillUploading = prev.some((up) => up.status === 'uploading');
        if (!stillUploading) setIsUploading(false);
        return prev;
      });
    }
  }, [projectId, orgId, queryClient]);

  const cancelUpload = useCallback((file: File) => {
    // In a real TUS implementation, we'd cancel the request.
    // For now, we just remove it from the list.
    setUploads((prev) => prev.filter((up) => up.file !== file));
  }, []);

  return {
    uploads,
    isUploading,
    uploadFile,
    cancelUpload,
  };
};
