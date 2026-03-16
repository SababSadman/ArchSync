import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { 
  Download, 
  X, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  FileText,
  FileCode,
  File as FileIcon,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { FileRecord } from '../../types/file';

// pdfjs logic would go here, but for now we'll use a standard object embed or simple iframe for simplicity in this baseline
// and focus on the zoomable image logic

interface FilePreviewModalProps {
  file: FileRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilePreviewModal({ file, open, onOpenChange }: FilePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (file && open) {
      setIsLoading(true);
      // Get signed URL for the file
      supabase.storage
        .from('project-files')
        .createSignedUrl(file.storage_path, 3600)
        .then(({ data, error }) => {
          if (data) setPreviewUrl(data.signedUrl);
          setIsLoading(false);
        });
    } else {
      setPreviewUrl(null);
      setZoom(1);
    }
  }, [file, open]);

  if (!file) return null;

  const isImage = file.mime_type.startsWith('image/');
  const isPdf = file.mime_type.includes('pdf');

  const handleDownload = async () => {
    if (!previewUrl) return;
    const response = await fetch(previewUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 overflow-hidden bg-slate-950 border-slate-800 shadow-2xl flex flex-col">
        <DialogHeader className="p-4 border-b border-white/5 bg-slate-900/50 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
               {isImage ? <ImageIcon className="w-4 h-4 text-emerald-400" /> : isPdf ? <FileText className="w-4 h-4 text-red-400" /> : <FileIcon className="w-4 h-4 text-slate-400" />}
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-white truncate max-w-[300px]" title={file.name}>
                {file.name}
              </DialogTitle>
              <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">
                {file.mime_type} • {(file.size_bytes / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isImage && (
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 mr-4">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-[10px] font-bold text-slate-400 w-10 text-center tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" className="h-8 gap-2 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Download</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white rounded-full bg-slate-800 border border-slate-700" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black overflow-hidden flex items-center justify-center p-8">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-400 animate-pulse">Loading preview...</p>
            </div>
          ) : previewUrl ? (
            <>
              {isImage && (
                <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-center p-4">
                  <img 
                    src={previewUrl} 
                    alt={file.name} 
                    className="max-w-none transition-transform duration-200 shadow-2xl"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>
              )}
              {isPdf && (
                <iframe 
                  src={`${previewUrl}#toolbar=0`} 
                  className="w-full h-full rounded-lg shadow-2xl bg-white"
                  title={file.name}
                />
              )}
              {!isImage && !isPdf && (
                <div className="text-center p-12 bg-slate-900/50 rounded-3xl border border-white/5 backdrop-blur-md">
                   <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <FileIcon className="w-10 h-10 text-slate-400" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Preview Not Available</h3>
                   <p className="text-sm text-slate-400 max-w-xs mx-auto mb-8">
                     Direct preview is not supported for this file type ({file.mime_type}). Please download the file to view it.
                   </p>
                   <Button onClick={handleDownload} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-[var(--accent)]/20">
                     Download File
                   </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-white">Preview unavailable.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
