import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { 
  Upload, 
  File, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  FileCode, 
  AlertCircle,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFileUpload } from '../../hooks/useFileUpload';

interface FileUploadZoneProps {
  projectId: string;
  orgId: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_TYPES = {
  'application/dwg': ['.dwg'],
  'application/dxf': ['.dxf'],
  'application/vnd.autodesk.revit': ['.rvt'],
  'application/x-sketchup': ['.skp'],
  'application/x-ifc': ['.ifc'],
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/x-photoshop': ['.psd'],
  'video/mp4': ['.mp4'],
};

export const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg': return <ImageIcon className="w-8 h-8 text-blue-500" />;
    case 'mp4': return <Video className="w-8 h-8 text-purple-500" />;
    case 'dwg':
    case 'dxf':
    case 'rvt':
    case 'skp':
    case 'ifc': return <FileCode className="w-8 h-8 text-orange-500" />;
    default: return <File className="w-8 h-8 text-gray-500" />;
  }
};

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ projectId, orgId }) => {
  const { uploads, uploadFile, cancelUpload } = useFileUpload(projectId, orgId);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const code = rejectedFiles[0].errors[0].code;
      if (code === 'file-too-large') {
        setError('File is too large. Max 500MB.');
      } else if (code === 'file-invalid-type') {
        setError('Unsupported file type.');
      } else {
        setError('Error selecting file.');
      }
    }

    acceptedFiles.forEach((file) => {
      uploadFile(file);
    });
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_TYPES,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[200px]",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Drag & drop files here</p>
          <p className="text-sm text-muted-foreground mt-1">
            or <span className="text-primary font-medium">browse files</span>
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            CAD, PDF, Images, Video (Max 500MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {uploads.length > 0 && (
        <div className="grid gap-3 max-h-[400px] overflow-y-auto p-1">
          {uploads.map((upload, idx) => (
            <div 
              key={`${upload.file.name}-${idx}`}
              className="bg-card border rounded-lg p-4 flex items-center gap-4 animate-in slide-in-from-right-4"
            >
              {getFileIcon(upload.file.name)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium truncate">{upload.file.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {(upload.file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "absolute top-0 left-0 h-full transition-all duration-300",
                      upload.status === 'error' ? "bg-destructive" : "bg-primary"
                    )}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
                {upload.error && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {upload.error}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {upload.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                {upload.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                <button 
                  onClick={() => cancelUpload(upload.file)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
