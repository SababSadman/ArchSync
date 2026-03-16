import { useState } from 'react';
import { Plus, FolderPlus, SearchX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { StatsBar } from '../components/projects/StatsBar';
import { FilterBar } from '../components/projects/FilterBar';
import { ProjectCard } from '../components/projects/ProjectCard';
import { NewProjectDialog } from '../components/projects/NewProjectDialog';
import { useProjects } from '../hooks/use-projects';
import { useProjectModal } from '../store/use-project-modal';

export default function ProjectsPage() {
  const { openModal } = useProjectModal();
  const [filters, setFilters] = useState({ status: 'all', phase: 'all', search: '' });
  const [sortBy, setSortBy] = useState('updated_at');

  const { data: projects, isLoading, isError } = useProjects(filters, { by: sortBy, order: 'desc' });

  // Statistics calculation
  const activeCount = projects?.filter(p => p.status === 'active').length || 0;
  const overdueCount = projects?.filter(p => {
    if (!p.deadline || p.status === 'completed') return false;
    return new Date(p.deadline) < new Date();
  }).length || 0;
  const utilization = projects && projects.length > 0 ? 78 : 0; // Mock utilization logic


  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight sm:text-4xl">Studio Portfolio</h1>
          <p className="mt-2 text-lg text-[var(--text-secondary)]">
            Organize, monitor, and scale your architectural projects.
          </p>
        </div>
        <Button 
          onClick={openModal}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Button>
      </div>

      <StatsBar 
        totalActive={activeCount} 
        overdueCount={overdueCount} 
        teamUtilization={utilization} 
      />

      <div className="bg-[var(--bg-raised)]/30 p-1 rounded-2xl border border-[var(--border-subtle)]">
        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-raised)] animate-pulse border border-[var(--border-subtle)]" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-24 bg-[var(--bg-surface)] rounded-3xl border border-dashed border-red-200">
           <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8 text-red-500" />
           </div>
          <h3 className="text-xl font-bold text-red-900">Connectivity Issue</h3>
          <p className="text-[var(--text-secondary)] mt-2">We couldn't reach the studio vault. Please check your connection.</p>
          <Button variant="outline" className="mt-6 border-red-200 text-red-700 hover:bg-red-50" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-24 bg-[var(--bg-surface)] rounded-3xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center gap-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--accent)]/10 to-blue-500/10 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
            <FolderPlus className="w-12 h-12 text-[var(--accent)]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Launch your first blueprint</h3>
            <p className="text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
              Your portfolio is currently empty. Start by creating a project to track phases, deadlines, and team progress.
            </p>
          </div>
          <Button 
             onClick={openModal}
             className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold h-12 px-10 rounded-xl"
          >
            Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </div>
  );
}
