import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/use-projects';
import { 
  ArrowLeft, 
  Files, 
  CheckSquare, 
  MessageSquare,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ProjectTasksModal } from '../components/projects/ProjectTasksModal';
import { useState } from 'react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === id);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);

  if (!project) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link to="/projects" className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-[28px] italic text-[var(--text-primary)]">{project.name}</h1>
          <p className="text-[12px] text-[var(--text-secondary)] font-medium">Project ID: {id} · {project.project_type}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Files', icon: Files, link: 'files', count: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tasks', icon: CheckSquare, link: '#', count: '4', color: 'text-orange-600', bg: 'bg-orange-50', isModal: true },
          { label: 'Comments', icon: MessageSquare, link: 'files', count: '28', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Team', icon: Users, link: 'team', count: '3', color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((c) => (
          <div 
            key={c.label} 
            onClick={() => {
              if (c.label === 'Tasks') {
                setIsTasksModalOpen(true);
              }
            }}
            className="cursor-pointer"
          >
            <Link 
              to={c.isModal ? '#' : (c.link.startsWith('/') ? c.link : `/projects/${id}/${c.link}`)}
              onClick={(e) => { if (c.isModal) e.preventDefault(); }}
              className="group h-full bg-white border border-[var(--border-subtle)] p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className={cn("absolute -right-2 -top-2 w-16 h-16 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500", c.color)}>
                <c.icon className="w-full h-full rotate-12" />
              </div>
              
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500", c.bg)}>
                <c.icon className={cn("w-5 h-5", c.color)} />
              </div>
              
              <div className="flex items-end justify-between relative z-10 mt-auto">
                <span className="text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors">{c.label}</span>
                <span className="font-serif text-[24px] italic text-[var(--text-primary)] leading-none">{c.count}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <ProjectTasksModal 
        open={isTasksModalOpen}
        onOpenChange={setIsTasksModalOpen}
        projectId={id || ''}
        projectName={project.name}
      />

      <div className="bg-white border border-[var(--border-subtle)] p-12 rounded-[24px] flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 rounded-full bg-[var(--bg-raised)] flex items-center justify-center mb-6">
            <Files className="w-8 h-8 text-[var(--text-tertiary)] opacity-40" />
         </div>
         <h2 className="font-serif text-[24px] italic text-[var(--text-primary)] mb-2">Detailed Context Coming Soon</h2>
         <p className="text-[var(--text-secondary)] font-medium max-w-sm mx-auto">
            The spatial overview and BIM interaction layer for {project.name} is being synchronized.
         </p>
         <Link to={`/projects/${id}/files`} className="mt-8 h-10 px-8 bg-[var(--text-primary)] text-white font-bold rounded-xl shadow-lg shadow-black/10 hover:opacity-90 transition-all text-[13px]">
            Go to Files
         </Link>
      </div>
    </div>
  );
}
