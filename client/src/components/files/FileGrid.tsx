import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { FileRecord } from '../../types/file';
import { getFileIcon } from './FileUploadZone';
import { 
  Download, 
  Eye, 
  History, 
  MoreVertical,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface FileGridProps {
  projectId: string;
  onPreview: (file: FileRecord) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ projectId, onPreview }) => {
  const { data: files, isLoading } = useQuery({
    queryKey: ['files', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          versions:file_versions(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FileRecord[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  // Grouping by Phase (Mock logic for now, ideally phase comes from file metadata)
  const groupedFiles = files?.reduce((acc, file) => {
    const phase = file.phase || 'Uncategorized';
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(file);
    return acc;
  }, {} as Record<string, FileRecord[]>);

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-2xl border-muted-foreground/10">
        <p className="text-muted-foreground">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.entries(groupedFiles || {}).map(([phase, phaseFiles]) => (
        <div key={phase} className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold capitalize">{phase.replace(/_/g, ' ')}</h3>
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">{phaseFiles.length} files</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {phaseFiles.map((file) => (
              <FileCard key={file.id} file={file} onPreview={onPreview} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const FileCard = ({ file, onPreview }: { file: FileRecord; onPreview: (f: FileRecord) => void }) => {
  const isImage = ['png', 'jpg', 'jpeg'].includes(file.file_type.toLowerCase());
  
  // In a real app, we'd get the public URL or signed URL for the thumbnail
  const meta = import.meta as unknown as { env: { VITE_SUPABASE_URL: string } };
  const thumbnailUrl = isImage 
    ? `${meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-files/${file.storage_path}`
    : null;

  return (
    <div className="group relative bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Thumbnail / Icon Area */}
      <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={file.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="scale-150 transform group-hover:scale-[1.7] transition-transform duration-500 opacity-20">
            {getFileIcon(file.name)}
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          <button 
            onClick={() => onPreview(file)}
            className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-lg" 
            title="Preview"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-2 bg-secondary text-secondary-foreground rounded-full hover:scale-110 transition-transform shadow-lg" title="Download">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 bg-secondary text-secondary-foreground rounded-full hover:scale-110 transition-transform shadow-lg" title="Versions">
            <History className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-background/50 rounded-md">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold text-sm truncate" title={file.name}>{file.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {(file.file_size / (1024 * 1024)).toFixed(1)} MB • {file.file_type.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              Project Lead
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {format(new Date(file.created_at), 'MMM d, yyyy')}
          </div>
        </div>
      </div>
    </div>
  );
};
