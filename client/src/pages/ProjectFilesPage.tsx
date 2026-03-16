import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { FileGrid } from '../components/files/FileGrid';
import { FilePreviewModal } from '../components/files/FilePreviewModal';
import { FileRecord } from '../types/file';
import { 
  FileBox, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  MoreHorizontal
} from 'lucide-react';

const ProjectFilesPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Mock orgId for demonstration - in a real app, this would come from context or project data
  const orgId = "org-123";

  if (!projectId) return <div>Project ID not found</div>;

  const handlePreview = (file: FileRecord) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FileBox className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Project Files</h1>
          </div>
          <p className="text-muted-foreground">Manage and preview all project assets, from CAD files to renders.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted p-1 rounded-lg border">
            <button className="p-2 bg-background rounded-md shadow-sm">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-background/50 rounded-md transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="p-2 border rounded-lg hover:bg-muted transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar / Upload Zone */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="font-bold text-lg">Upload Files</h3>
              <p className="text-sm text-muted-foreground mt-1">Add new resources to this project.</p>
            </div>
            
            <FileUploadZone projectId={projectId} orgId={orgId} phase="schematic" />
            
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-semibold">4.2 GB / 50 GB</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[8%]" />
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <h4 className="font-bold text-sm text-primary mb-2">Search Library</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Find by name, type, or phase..." 
                className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="lg:col-span-8">
            {/* In a real implementation we would fetch files here, but for this page we'll use a placeholder or remove it if unused */}
            <p className="text-sm text-slate-500 italic mb-4">Note: This page is currently for demonstration. Use the Project Card 'Files' button for active management.</p>
            <FileGrid files={[]} isLoading={false} onPreview={handlePreview} />
        </div>
      </div>

      {/* Preview Modal */}
      <FilePreviewModal 
        file={selectedFile}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
};

export default ProjectFilesPage;
