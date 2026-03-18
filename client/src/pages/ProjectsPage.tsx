import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FolderOpen,
  ChevronDown
} from 'lucide-react';
import { useProjects } from '../hooks/use-projects';
import { useProjectModal } from '../store/use-project-modal';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { EmptyState } from '../components/ui/EmptyState';
import { NewProjectDialog } from '../components/projects/NewProjectDialog';
import { ProjectCard } from '../components/projects/ProjectCard';
import { FilterBar } from '../components/projects/FilterBar';
import { cn } from '../lib/utils';

const phaseColors: Record<string, string> = {
  schematic: 'bg-[#7C3AED]',
  design_dev: 'bg-[#1F6FEB]',
  construction: 'bg-[#D97706]',
  closeout: 'bg-[#16A34A]'
};

export default function ProjectsPage() {
  const [filters, setFilters] = useState({ status: 'all', phase: 'all', search: '' });
  const [sortBy, setSortBy] = useState('updated_at');
  
  const { data: projects, isLoading } = useProjects(filters, { by: sortBy, order: 'desc' });
  const { isOpen, setIsOpen, openModal } = useProjectModal();

  const filteredProjects = projects; // Filtering handled by hook

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="font-serif text-[clamp(24px,2.5vw,32px)] text-[var(--text-primary)] italic">
            Projects Portfolio
          </h1>
          <p className="text-[var(--text-secondary)] font-medium mt-1">
            Studio-wide register and coordination hub.
          </p>
        </div>
        <button 
          onClick={openModal}
          className="h-10 px-6 bg-[var(--text-primary)] text-white text-[13px] font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 shadow-sm" /> New Project
        </button>
      </div>

      {/* Filter Row */}
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredProjects.map((project) => (
            <div key={project.id} onClick={() => window.location.href = `/projects/${project.id}`} className="cursor-pointer">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first studio project to begin syncing files and collaborating."
          action={
            <button 
              onClick={openModal}
              className="h-10 px-8 bg-[var(--accent)] text-white text-[13px] font-bold rounded-xl hover:bg-[var(--accent-dark)] transition-all shadow-lg shadow-blue-500/20"
            >
              Start New Project
            </button>
          }
        />
      )}

      {/* Modals */}
      <NewProjectDialog 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </div>
  );
}
