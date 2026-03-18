import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  Plus, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  Upload,
  Clock,
  Briefcase,
  Layers,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useProjects } from '../hooks/use-projects';
import { useAuth } from '../hooks/use-auth';
import { SkeletonCard } from '../components/ui/SkeletonCard';

const gradients = [
  'from-[#7C3AED] to-[#1F6FEB]',
  'from-[#D97706] to-[#F59E0B]',
  'from-[#16A34A] to-[#0891B2]',
  'from-[#DC2626] to-[#7C3AED]'
];

const phaseColors: Record<string, string> = {
  schematic: 'var(--purple)',
  design_dev: 'var(--accent)',
  construction: 'var(--orange)',
  closeout: 'var(--green)'
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: projects, isLoading } = useProjects();
  
  const userName = user?.email?.split('@')[0] || 'Studio User';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[clamp(24px,2.5vw,32px)] text-[var(--text-primary)] italic">
            Good morning, {userName} 👋
          </h1>
          <p className="text-[var(--text-tertiary)] font-mono text-[10px] uppercase tracking-widest mt-2 font-bold">
            Studio Meridian · {projects?.length || 0} active projects
          </p>
        </div>
        <Link 
          to="/projects" 
          className="h-10 px-5 bg-[var(--text-primary)] text-white text-[13px] font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: projects?.length || 0, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+1 this month' },
          { label: 'Files This Week', value: 23, icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12% vs last week' },
          { label: 'Open Tasks', value: 7, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', trend: '3 due tomorrow' },
          { label: 'Pending Approvals', value: 2, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Response req' }
        ].map((s) => (
          <div key={s.label} className="group bg-white border border-[var(--border-subtle)] p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden">
            {/* Background Decoration */}
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700", s.color)}>
              <s.icon className="w-full h-full rotate-12" />
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <ArrowUpRight className="w-3 h-3" />
                {s.trend.split(' ')[0]}
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <span className="font-serif text-[clamp(28px,3vw,36px)] italic text-[var(--text-primary)] leading-none block">
                {s.value}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-tight">
                  {s.label}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-tertiary)] font-bold uppercase tracking-widest opacity-60">
                  {s.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">
            Recent Projects
          </h2>
          <Link to="/projects" className="text-[var(--accent)] text-[11px] font-bold hover:underline">
            View All Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : projects?.slice(0, 3).map((project, idx) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}`}
              className="group bg-white border border-[var(--border-default)] rounded-[18px] overflow-hidden hover:border-[var(--border-strong)] transition-all hover:shadow-xl hover:shadow-black/5 flex flex-col h-full"
            >
              <div className={cn("h-20 bg-gradient-to-br w-full relative", gradients[idx % gradients.length])}>
                <div 
                  className="absolute top-3 right-3 w-2 h-2 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: phaseColors[project.phase] || 'gray' }}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-[13px] font-bold text-[var(--text-primary)] truncate mb-1">
                  {project.name}
                </h3>
                <p className="font-mono text-[9px] text-[var(--text-tertiary)] mb-4 tracking-tight uppercase">
                  {project.project_type} · ID: {project.id.slice(0, 8)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                  <span className={cn(
                    "font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                    project.phase === 'schematic' ? 'bg-[#F3EFFE] text-[#7C3AED]' : 
                    project.phase === 'design_dev' ? 'bg-[#EEF4FF] text-[#1F6FEB]' :
                    'bg-[#FFFBEB] text-[#D97706]'
                  )}>
                    {(project.phase || 'schematic').replace('_', ' ')}
                  </span>
                  <div className="flex -space-x-1.5 pl-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full bg-[var(--bg-raised)] border-2 border-white flex items-center justify-center overflow-hidden">
                        <span className="text-[7px] font-black text-[var(--text-tertiary)]">U{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity Feed Section */}
      <section className="bg-white border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border-subtle)]">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {[
            { icon: Upload, color: 'bg-[var(--accent-subtle)] text-[var(--accent)]', type: 'file_upload', user: 'Ana Kim', target: 'Section Drawings', time: '2m ago' },
            { icon: MessageSquare, color: 'bg-orange-50 text-orange-600', type: 'comment', user: 'Julian Solo', target: 'Riverside Tower', time: '14h ago' },
            { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', type: 'approval', user: 'Project Lead', target: 'Lobby Design', time: 'Yesterday' },
            { icon: FileText, color: 'bg-purple-50 text-purple-600', type: 'specification', user: 'Ana Kim', target: 'Door Schedule', time: 'Mar 12' }
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-[var(--bg-raised)] transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", activity.color)}>
                  <activity.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] text-[var(--text-primary)] font-medium">
                    <span className="font-semibold">{activity.user}</span> 
                    <span className="text-[var(--text-secondary)] font-normal"> updated </span>
                    <span className="font-semibold">{activity.target}</span>
                  </p>
                  <span className="font-mono text-[9px] text-[var(--text-tertiary)] uppercase tracking-tight mt-1">
                    {activity.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-tertiary)] font-medium">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
        <button className="w-full py-4 text-[11px] font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] border-t border-[var(--border-subtle)] transition-all">
          View all session history
        </button>
      </section>
    </div>
  );
}
