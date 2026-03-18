import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, FileCode, CheckCircle, AlertCircle, X, Image as ImageIcon, File, Wand2, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { useFileUpload } from '../../hooks/useFileUpload';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface FileUploadZoneProps {
  projectId: string;
  projectName: string;
  orgId: string;
  phase: string;
  className?: string;
  onUploadComplete?: () => void;
}

export function FileUploadZone({ projectId, projectName, orgId, phase, className, onUploadComplete }: FileUploadZoneProps) {
  const { uploads, uploadFile, cancelUpload, clearUploads } = useFileUpload({ projectId, orgId, phase });

  const suggestName = async (originalFile: File) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/suggest-name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalName: originalFile.name,
          phase,
          projectName
        })
      });
      const data = await response.json();
      if (data.suggestedName) {
        return data.suggestedName;
      }
    } catch (error) {
      console.error('AI Suggestion Failed:', error);
    }
    return originalFile.name;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      // Limit to 500MB
      if (file.size > 500 * 1024 * 1024) {
        alert(`File ${file.name} is too large (> 500MB)`);
        return;
      }
      uploadFile(file);
    });
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 500 * 1024 * 1024,
  });

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'].includes(ext || '')) return <ImageIcon className="w-5 h-5 text-emerald-500" />;
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (['dwg', 'dxf', 'rvt', 'ifc', 'skp'].includes(ext || '')) return <FileCode className="w-5 h-5 text-blue-500" />;
    if (['mp4', 'mov', 'webm'].includes(ext || '')) return <Video className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        {...getRootProps()} 
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group",
          isDragActive 
            ? "border-[var(--accent)] bg-[var(--accent)]/5" 
            : "border-[var(--border-default)] hover:border-[var(--accent)] hover:bg-slate-50/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--border-subtle)] shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
          <Upload className={cn("w-6 h-6", isDragActive ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]")} />
        </div>
        <div className="text-center">
          <p className="text-[14px] font-bold text-[var(--text-primary)]">
            {isDragActive ? "Syncing now..." : "Drop assets to sync"}
          </p>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5 font-bold font-mono uppercase tracking-tighter opacity-80">
             DWG · RVT · IFC · SKP · PDF · PNG
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="font-bold uppercase tracking-widest text-[10px] h-9 gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            Browse Files
          </Button>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="bg-[var(--bg-raised)]/50 rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
              Upload Progress
            </span>
            <button 
              onClick={clearUploads}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
            >
              Clear
            </button>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {uploads.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] shadow-sm">
                <div className="shrink-0">
                  {getFileIcon(u.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[var(--text-primary)] truncate block mr-2">
                      {u.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {u.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                      {u.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                      <span className="text-[10px] font-black text-slate-400 tabular-nums">
                        {u.status === 'uploading' ? `${u.progress}%` : u.status}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        u.status === 'error' ? "bg-red-500" : "bg-[var(--accent)]",
                        u.status === 'completed' && "bg-emerald-500"
                      )}
                      style={{ width: `${u.status === 'completed' ? 100 : u.progress}%` }}
                    />
                  </div>
                  {u.error && (
                    <p className="text-[9px] text-red-500 font-medium mt-1 leading-none">
                      {u.error}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => cancelUpload(u.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
