import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { FileGrid } from '../components/files/FileGrid';
import { FilePreviewModal } from '../components/files/FilePreviewModal';
import { FileRecord } from '../types/file';
import { useProjectFiles } from '../hooks/use-project-files';
import { useProjects } from '../hooks/use-projects';
import { useAuth } from '../hooks/use-auth';
import { useProjectMembers } from '../hooks/use-members';
import { 
  FileBox, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  MoreHorizontal,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProjectFilesPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === projectId);
  const { data: files, isLoading, refetch } = useProjectFiles(projectId || '');

  const { user } = useAuth();
  const { data: members } = useProjectMembers(projectId || '');
  const currentUserRole = members?.find(m => m.user_id === user?.id)?.role;
  const isReadOnly = currentUserRole === 'viewer' || currentUserRole === 'client';

  if (!projectId) return null;

  const handlePreview = (file: FileRecord) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Breadcrumb / Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-subtle)] pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
            <span className="hover:text-[var(--accent)] cursor-pointer transition-colors">Projects</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--text-secondary)]">{project?.name || 'Loading...'}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-[var(--text-primary)] flex items-center justify-center shadow-lg shadow-black/10">
                <FileBox className="w-6 h-6 text-white" />
             </div>
             <h1 className="font-serif text-[clamp(24px,2.5vw,32px)] text-[var(--text-primary)] italic">
                Project Assets
             </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isReadOnly && (
            <>
              <button className="h-10 px-5 bg-[var(--bg-raised)] border border-[var(--border-default)] text-[var(--text-secondary)] rounded-xl text-[12px] font-bold flex items-center gap-2 hover:bg-white transition-all">
                <Plus className="w-4 h-4" /> New Folder
              </button>
              <button className="h-10 px-6 bg-[var(--text-primary)] text-white text-[12px] font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md">
                <FileBox className="w-4 h-4" /> Batch Sync
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sidebar: Controls & Upload */}
        <div className="lg:col-span-4 space-y-6">
           {/* Section 1: Upload (Hidden for Viewers/Clients) */}
           {!isReadOnly && (
             <div className="bg-white border border-[var(--border-subtle)] rounded-[24px] p-6 shadow-sm overflow-hidden relative">
                <div className="flex items-center justify-between mb-6">
                   <div>
                      <h3 className="text-[13px] font-bold text-[var(--text-primary)]">Sync Assets</h3>
                      <p className="text-[11px] text-[var(--text-tertiary)] font-medium">Auto-versioning enabled.</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                   </div>
                </div>
                <FileUploadZone 
                  projectId={projectId} 
                  orgId={project?.organization_id || ''} 
                  projectName={project?.name || 'Project'}
                  phase={project?.phase || 'schematic'} 
                  onUploadComplete={refetch}
                />
             </div>
           )}

           {/* Section 2: Search & Filter */}
           <div className="bg-white border border-[var(--border-subtle)] rounded-[24px] p-6 shadow-sm space-y-6">
              <div className="space-y-2 group">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black px-1">Search Library</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Drawing name, number..." 
                    className="w-full h-11 pl-10 pr-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none focus:border-[var(--accent)] focus:bg-white transition-all font-medium text-[12px]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                 <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black px-1">Quick Filters</label>
                 <div className="flex flex-wrap gap-2">
                    {['RVT', 'IFC', 'DWG', 'PDF', 'Drafts'].map(tag => (
                       <button key={tag} className="px-3 py-1.5 border border-[var(--border-default)] rounded-full text-[10px] font-black text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all uppercase tracking-tighter">
                          {tag}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Pane: File Browser */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between bg-[var(--bg-raised)]/30 border border-[var(--border-subtle)] rounded-2xl p-3">
             <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-[var(--border-subtle)] shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("w-9 h-9 flex items-center justify-center rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-[var(--accent)] shadow-sm" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("w-9 h-9 flex items-center justify-center rounded-lg transition-all", viewMode === 'list' ? "bg-white text-[var(--accent)] shadow-sm" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]")}
                >
                  <List className="w-4 h-4" />
                </button>
             </div>

             <div className="flex items-center gap-4 px-3">
                <button className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                   <Filter className="w-3.5 h-3.5" /> Sort by Date
                </button>
                <div className="w-px h-5 bg-[var(--border-subtle)]" />
                <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                   <MoreHorizontal className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="min-h-[400px]">
            <FileGrid 
              files={files || []} 
              isLoading={isLoading} 
              onPreview={handlePreview} 
            />
          </div>
        </div>
      </div>

      {/* Preview Modal for BIM & Comments */}
      <FilePreviewModal 
        file={selectedFile}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}
