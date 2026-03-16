import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export interface UploadState {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  file?: File;
}

export interface UploadParams {
  projectId: string;
  orgId: string;
  phase: string;
}

export function useFileUpload({ projectId, orgId, phase }: UploadParams) {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const queryClient = useQueryClient();

  const uploadFile = useCallback(async (file: File) => {
    const uploadId = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    const fileName = file.name;
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
    const storagePath = `${orgId}/${projectId}/${timestamp}_${sanitizedName}`;

    setUploads(prev => [...prev, {
      id: uploadId,
      name: fileName,
      progress: 0,
      status: 'uploading',
      file
    }]);

    try {
      // 1. Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('project-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) throw storageError;

      // 2. Check if file record already exists for versioning
      const { data: existingFile } = await supabase
        .from('files')
        .select('id, name')
        .eq('project_id', projectId)
        .eq('name', fileName)
        .maybeSingle();

      let fileId: string;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (existingFile) {
        fileId = existingFile.id;
        // Get last version number
        const { data: lastVersion } = await supabase
          .from('file_versions')
          .select('version_number')
          .eq('file_id', fileId)
          .order('version_number', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        const nextVersion = (lastVersion?.version_number || 1) + 1;

        // Add to file_versions
        const { error: versionError } = await supabase
          .from('file_versions')
          .insert({
            file_id: fileId,
            storage_path: storagePath,
            version_number: nextVersion,
            size_bytes: file.size,
            uploaded_by: user.id
          });

        if (versionError) throw versionError;

        // Update files table updated_at
        await supabase.from('files').update({ updated_at: new Date().toISOString() }).eq('id', fileId);
      } else {
        const { data: newFile, error: fileError } = await supabase
          .from('files')
          .insert({
            name: fileName,
            storage_path: storagePath,
            mime_type: file.type || 'application/octet-stream',
            size_bytes: file.size,
            project_id: projectId,
            phase: phase,
            uploaded_by: user.id
          })
          .select()
          .single();

        if (fileError) throw fileError;
        fileId = newFile.id;

        // Initial version
        await supabase.from('file_versions').insert({
          file_id: fileId,
          storage_path: storagePath,
          version_number: 1,
          size_bytes: file.size,
          uploaded_by: user.id
        });
      }

      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, progress: 100, status: 'completed' } : u
      ));

      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });

    } catch (err: any) {
      console.error('Upload Error:', err);
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, status: 'error', error: err.message } : u
      ));
    }
  }, [projectId, orgId, phase, queryClient]);

  const cancelUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  return {
    uploads,
    isUploading: uploads.some(u => u.status === 'uploading'),
    uploadFile,
    cancelUpload,
    clearUploads
  };
}
