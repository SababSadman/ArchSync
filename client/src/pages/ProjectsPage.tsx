import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { StatsBar } from '../components/projects/StatsBar';
import { FilterBar } from '../components/projects/FilterBar';
import { ProjectCard } from '../components/projects/ProjectCard';
import { NewProjectDialog } from '../components/projects/NewProjectDialog';
import { useProjects } from '../hooks/use-projects';

export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', phase: 'all', search: '' });
  const [sortBy, setSortBy] = useState('updated_at');

  const { data: projects, isLoading, isError } = useProjects(filters, { by: sortBy, order: 'desc' });

  // Calculate mock stats (replace with actual calculations from data if available)
  const activeCount = projects?.filter(p => p.status === 'active').length || 0;
  const overdueCount = projects?.filter(p => p.deadline && new Date(p.deadline) < new Date() && p.status !== 'completed').length || 0;
  const utilization = 84; // Mock utilization

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Project Portfolio</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage and track all studio architecture projects in one place.</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <StatsBar 
        totalActive={activeCount} 
        overdueCount={overdueCount} 
        teamUtilization={utilization} 
      />

      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[320px] rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[var(--border-default)]">
          <p className="text-red-500 font-medium">Error loading projects. Please try again.</p>
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[var(--border-default)] flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-base)] flex items-center justify-center">
            <Plus className="w-8 h-8 text-[var(--text-tertiary)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create your first project</h3>
            <p className="text-sm text-[var(--text-secondary)]">You haven't added any projects to your portfolio yet.</p>
          </div>
          <Button 
             variant="outline"
             onClick={() => setIsDialogOpen(true)}
             className="border-[var(--border-default)] hover:bg-[var(--bg-raised)]"
          >
            Get started
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <NewProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
}
