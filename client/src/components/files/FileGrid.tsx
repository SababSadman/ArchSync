import { useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  FileText, 
  FileCode, 
  FileIcon, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  History, 
  MoreVertical 
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { FileRecord } from '../../types/file';

interface FileGridProps {
  files: FileRecord[];
  isLoading?: boolean;
  onPreview?: (file: FileRecord) => void;
  onDownload?: (file: FileRecord) => void;
  onViewVersions?: (file: FileRecord) => void;
}

const phaseOrder = ['schematic', 'design_dev', 'construction', 'closeout'];
const phaseLabels: Record<string, string> = {
  schematic: 'Schematic Design',
  design_dev: 'Design Development',
  construction: 'Construction Documents',
  closeout: 'Project Closeout'
};

export function FileGrid({ files, isLoading, onPreview, onDownload, onViewVersions }: FileGridProps) {
  const groupedFiles = useMemo(() => {
    const groups: Record<string, FileRecord[]> = {};
    files.forEach(file => {
      if (!groups[file.phase]) groups[file.phase] = [];
      groups[file.phase].push(file);
    });
    return groups;
  }, [files]);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-emerald-500/80" />;
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500/80" />;
    if (mimeType.includes('dwg') || mimeType.includes('dxf')) return <FileCode className="w-8 h-8 text-blue-500/80" />;
    return <FileIcon className="w-8 h-8 text-slate-400/80" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-[var(--border-subtle)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {phaseOrder.map(phase => {
        const phaseFiles = groupedFiles[phase] || [];
        if (phaseFiles.length === 0) return null;

        return (
          <div key={phase} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-[var(--accent)] rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {phaseLabels[phase]} ({phaseFiles.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {phaseFiles.map((file) => (
                <Card key={file.id} className="group overflow-hidden bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-sm hover:shadow-xl transition-all duration-300 relative border-b-2 border-b-transparent hover:border-b-[var(--accent)]">
                  {/* Thumbnail / Icon Area */}
                  <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center relative overflow-hidden">
                    {file.mime_type.startsWith('image/') ? (
                      // We'd ideally use a pre-signed URL here for private storage
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        {getFileIcon(file.mime_type)}
                      </div>
                    ) : (
                      getFileIcon(file.mime_type)
                    )}

                    {/* Hover Overlays */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white rounded-full" onClick={() => onPreview?.(file)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white rounded-full" onClick={() => onDownload?.(file)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white rounded-full" onClick={() => onViewVersions?.(file)}>
                        <History className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-1 mb-3">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <p className="text-[10px] text-[var(--text-tertiary)] font-medium mt-0.5">
                          {formatFileSize(file.size_bytes)} • {format(new Date(file.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5 border border-white dark:border-slate-900 shadow-sm">
                          <AvatarImage src={file.uploader?.avatar_url} />
                          <AvatarFallback className="text-[8px] bg-slate-100 font-bold">
                            {(file.uploader?.full_name || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[9px] font-bold text-[var(--text-secondary)] truncate max-w-[80px]">
                          {file.uploader?.full_name || 'Unknown'}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-tighter py-0 px-1.5 h-4 bg-slate-50 border-slate-200 text-slate-500">
                        {file.mime_type.split('/').pop()?.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {files.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-3xl bg-slate-50/50">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-[var(--border-subtle)]">
            <FileIcon className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-sm font-bold text-[var(--text-secondary)]">No files uploaded yet.</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Files uploaded to this phase will appear here.</p>
        </div>
      )}
    </div>
  );
}
