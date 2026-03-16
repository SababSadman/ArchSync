import React, { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  FileCode,
  Info,
  Maximize2
} from 'lucide-react';
import { FileRecord } from '../../types/file';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FilePreviewModalProps {
  file: FileRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [pdfPage, setPdfPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file || file.file_type.toLowerCase() !== 'pdf' || !isOpen) return;

    const renderPdf = async () => {
      const meta = import.meta as unknown as { env: { VITE_SUPABASE_URL: string } };
      const url = `${meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-files/${file.storage_path}`;
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);

      const page = await pdf.getPage(pdfPage);
      const scale = 1.5 * zoom;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      // @ts-ignore - Handle version differences in pdfjs-dist types
      await page.render(renderContext).promise;
    };

    renderPdf();
  }, [file, isOpen, pdfPage, zoom]);

  if (!isOpen || !file) return null;

  const isImage = ['png', 'jpg', 'jpeg'].includes(file.file_type.toLowerCase());
  const isPdf = file.file_type.toLowerCase() === 'pdf';
  const isCad = ['dwg', 'dxf', 'rvt', 'skp', 'ifc'].includes(file.file_type.toLowerCase());

  const meta = import.meta as unknown as { env: { VITE_SUPABASE_URL: string } };
  const fileUrl = `${meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-files/${file.storage_path}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      <div className="relative bg-card border rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg border">
              <FileCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">{file.name}</h2>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-tight">
                {file.file_type} • {(file.file_size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href={fileUrl} 
              download 
              className="p-2 hover:bg-muted rounded-full transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-8 min-h-0">
          {isImage && (
            <div className="relative group max-w-full max-h-full">
              <img 
                src={fileUrl} 
                alt={file.name} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur border rounded-full px-4 py-2 flex items-center gap-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-muted rounded-full">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1 hover:bg-muted rounded-full">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-border" />
                <button onClick={() => setZoom(1)} className="p-1 hover:bg-muted rounded-full">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {isPdf && (
            <div className="flex flex-col items-center gap-6 max-w-full">
              <div className="relative group bg-white p-4 shadow-2xl rounded-sm">
                <canvas ref={canvasRef} className="max-w-full shadow-lg" />
                
                {numPages > 1 && (
                  <div className="absolute top-1/2 -translate-y-1/2 inset-x-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <button 
                      onClick={() => setPdfPage(p => Math.max(1, p - 1))}
                      disabled={pdfPage === 1}
                      className="p-3 bg-background/80 backdrop-blur rounded-full shadow-xl pointer-events-auto disabled:opacity-50"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setPdfPage(p => Math.min(numPages, p + 1))}
                      disabled={pdfPage === numPages}
                      className="p-3 bg-background/80 backdrop-blur rounded-full shadow-xl pointer-events-auto disabled:opacity-50"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-background/80 backdrop-blur border rounded-full px-6 py-3 flex items-center gap-6 shadow-xl">
                 <div className="flex items-center gap-3">
                   <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-muted rounded-full">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1 hover:bg-muted rounded-full">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                 </div>
                 <div className="w-px h-6 bg-border" />
                 <span className="text-sm font-medium">Page {pdfPage} of {numPages}</span>
              </div>
            </div>
          )}

          {isCad && (
            <div className="max-w-md w-full bg-card border rounded-2xl p-8 space-y-6 shadow-xl">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
                  <FileCode className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">CAD Resource</h3>
                  <p className="text-muted-foreground text-sm px-4">
                    Full CAD viewer integration is coming in the next version. For now, you can view metadata and download the file.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Uploaded</p>
                  <p className="text-sm font-medium">{format(new Date(file.created_at), 'MMM d, yyyy')}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Version</p>
                  <p className="text-sm font-medium">v{file.versions?.length || 1}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>Metadata extraction in progress...</span>
                </div>
                <a 
                  href={fileUrl} 
                  download 
                  className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  <Download className="w-5 h-5" />
                  Download to View Local
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
