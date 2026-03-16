import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { FileUploadZone } from './FileUploadZone';
import { FileGrid } from './FileGrid';
import { FilePreviewModal } from './FilePreviewModal';
import { useProjectFiles } from '../../hooks/use-project-files';
import { FileRecord } from '../../types/file';
import { FolderOpen, Upload, FileCog } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProjectFilesDialogProps {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectFilesDialog({ projectId, projectName, open, onOpenChange }: ProjectFilesDialogProps) {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  
  const { data: files, isLoading } = useProjectFiles(projectId);

  useEffect(() => {
    // Get project's organization_id for storage paths
    supabase.from('projects').select('organization_id').eq('id', projectId).single()
      .then(({ data }) => {
        if (data) setOrgId(data.organization_id);
      });
  }, [projectId]);

  const handlePreview = (file: FileRecord) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        onClose={() => onOpenChange(false)}
        className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-2xl flex flex-col"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-[var(--accent)]" />
        
        <DialogHeader className="px-8 pt-8 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Project Assets</DialogTitle>
              <DialogDescription className="text-[var(--text-secondary)] font-medium mt-1">
                Central repository for <span className="text-[var(--text-primary)] font-bold">{projectName}</span>
              </DialogDescription>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'browse' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Browse
              </button>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'upload' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {activeTab === 'upload' ? (
            <div className="max-w-2xl mx-auto py-10">
              <div className="mb-10 text-center">
                 <h3 className="text-lg font-bold text-[var(--text-primary)]">Upload Project Documentation</h3>
                 <p className="text-sm text-[var(--text-tertiary)] mt-1">Upload blueprints, site photos, or coordination PDFs.</p>
              </div>
              <FileUploadZone 
                projectId={projectId} 
                orgId={orgId || ''} 
                phase="schematic" // Defaulting to schematic, could be tied to current project phase
                onUploadComplete={() => setActiveTab('browse')}
              />
              <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                     <FileCog className="w-5 h-5 text-emerald-600" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">Auto-Versioning Enabled</h4>
                     <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                       If you upload a file with the same name, ArchSync will automatically create a new version instead of overwriting the previous one.
                     </p>
                   </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('browse')}
                  className="gap-2 text-slate-500 hover:text-[var(--accent)] font-bold text-xs uppercase tracking-widest"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Back to Asset Library
                </Button>
              </div>
            </div>
          ) : (
            <FileGrid 
              files={files || []} 
              isLoading={isLoading} 
              onPreview={handlePreview}
            />
          )}
        </div>

        <FilePreviewModal 
          file={selectedFile} 
          open={isPreviewOpen} 
          onOpenChange={setIsPreviewOpen} 
        />
      </DialogContent>
    </Dialog>
  );
}
