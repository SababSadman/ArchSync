import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/use-projects';
import { useProjectMembers } from '../hooks/use-members';
import { useProjectFiles } from '../hooks/use-project-files';
import { 
  FileBox, 
  Users, 
  Calendar, 
  Settings, 
  ArrowRight, 
  Clock, 
  Shield, 
  Activity,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data: projects = [] } = useProjects();
  const project = projects.find(p => p.id === id);
  const { data: members = [] } = useProjectMembers(id || '');
  const { data: files = [] } = useProjectFiles(id || '');

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-xl font-bold">Project not found</h2>
        <Link to="/projects">
          <Button variant="outline">Back to Portfolio</Button>
        </Link>
      </div>
    );
  }

  const phaseColors: Record<string, string> = {
    schematic: 'bg-violet-500',
    design_dev: 'bg-blue-500',
    construction: 'bg-orange-500',
    closeout: 'bg-emerald-500',
  };

  const navCards = [
    { 
      title: 'Project Files', 
      desc: 'CAD drawings, models, and renders', 
      stats: `${files.length} Assets`, 
      link: `/projects/${id}/files`, 
      icon: FileBox, 
      color: 'bg-blue-500/10 text-blue-500' 
    },
    { 
      title: 'Team Members', 
      desc: 'Collaboration and permissions', 
      stats: `${members.length} Members`, 
      link: '#', 
      icon: Users, 
      color: 'bg-violet-500/10 text-violet-500' 
    },
    { 
      title: 'Specifications', 
      desc: 'Materials and technical docs', 
      stats: 'Pending', 
      link: '#', 
      icon: Shield, 
      color: 'bg-amber-500/10 text-amber-500' 
    },
    { 
      title: 'Activity log', 
      desc: 'Audit trail and version history', 
      stats: 'Global', 
      link: '#', 
      icon: Activity, 
      color: 'bg-emerald-500/10 text-emerald-500' 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Hero Section */}
      <div className="relative h-64 rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
         <div className="absolute inset-0 bg-[var(--accent)]/10 animate-pulse" />
         
         <div className="absolute bottom-8 left-8 z-20 space-y-3">
            <div className="flex items-center gap-3">
               <Badge className={cn("px-3 py-1 font-black uppercase text-[10px] tracking-widest rounded-lg h-6", phaseColors[project.phase])}>
                  {project.phase.replace('_', ' ')}
               </Badge>
               <span className="text-white/40 text-[10px] font-mono tracking-tighter uppercase">ID: {project.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">{project.name}</h1>
            <p className="text-slate-400 text-sm max-w-xl italic leading-relaxed">
              {project.description || 'Transforming architectural visions into digital reality with precision and collaborative excellence.'}
            </p>
         </div>

         <div className="absolute top-8 right-8 z-20">
            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl bg-white/10 border-white/10 text-white backdrop-blur-md hover:bg-[var(--accent)] hover:text-white transition-all transform hover:rotate-90">
               <Settings className="w-5 h-5" />
            </Button>
         </div>
      </div>

      {/* Stats & Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Deadline', val: project.deadline ? format(new Date(project.deadline), 'MMM dd, yyyy') : 'No Date', sub: 'Project Goal', icon: Calendar },
           { label: 'Timeline', val: 'On Track', sub: 'Studio Alert', icon: TrendingUp },
           { label: 'Updated', val: formatDistanceToNow(new Date(project.updated_at), { addSuffix: true }), sub: 'Last Change', icon: Clock },
           { label: 'Collaborators', val: members.length, sub: 'Active Seatings', icon: Users },
         ].map(item => (
           <Card key={item.label} className="bg-[var(--bg-surface)] border-[var(--border-subtle)] flex items-center p-4 gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/50 text-slate-400">
                 <item.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">{item.label}</p>
                 <p className="text-xs font-bold text-[var(--text-primary)] truncate">{item.val}</p>
              </div>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Navigation */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-[var(--text-tertiary)]">Navigation & Operations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {navCards.map(card => (
                 <Link key={card.title} to={card.link} className="block group">
                   <Card className="h-full bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent)]/50 hover:shadow-xl transition-all relative overflow-hidden active:scale-[0.98]">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-150 transition-transform duration-700">
                         <card.icon className="w-24 h-24" />
                      </div>
                      <CardContent className="p-6 space-y-4">
                         <div className={cn("inline-flex p-3 rounded-2xl", card.color)}>
                            <card.icon className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-black text-lg text-[var(--text-primary)]">{card.title}</h4>
                               <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:translate-x-1 group-hover:text-[var(--accent)] transition-all" />
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mb-4">{card.desc}</p>
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-900 text-[10px] font-mono px-2 py-0.5 rounded-md border-none">
                               {card.stats}
                            </Badge>
                         </div>
                      </CardContent>
                   </Card>
                 </Link>
               ))}
            </div>
         </div>

         {/* Sidebar / Phase Tracker */}
         <div className="space-y-8">
            <Card className="bg-slate-950 border-white/5 text-white p-6 rounded-3xl relative overflow-hidden">
               <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Phase Roadmap
               </h3>
               
               <div className="space-y-6 relative">
                  {['schematic', 'design_dev', 'construction', 'closeout'].map((p, idx) => {
                    const isCurrent = project.phase === p;
                    const isPassed = idx < ['schematic', 'design_dev', 'construction', 'closeout'].indexOf(project.phase);
                    
                    return (
                      <div key={p} className="flex gap-4 group">
                        <div className="flex flex-col items-center gap-2">
                           <div className={cn(
                             "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all shadow-lg",
                             isCurrent ? "bg-emerald-500 border-emerald-400 scale-125 ring-4 ring-emerald-500/20" : 
                             isPassed ? "bg-slate-800 border-emerald-500/50" : "bg-slate-900 border-slate-700"
                           )}>
                              {(isPassed || isCurrent) && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                           </div>
                           {idx < 3 && <div className={cn("w-[2px] h-full rounded-full transition-colors", isPassed ? "bg-emerald-500/50" : "bg-slate-800")} />}
                        </div>
                        <div className="pb-2">
                           <h4 className={cn(
                             "text-[13px] font-bold transition-colors uppercase tracking-tight",
                             isCurrent ? "text-white" : isPassed ? "text-slate-300" : "text-slate-600"
                           )}>
                             {p.replace('_', ' ')}
                           </h4>
                           <p className="text-[10px] text-slate-500">
                             {isCurrent ? 'Current Goal' : isPassed ? 'Archived Milestone' : 'Upcoming Phase'}
                           </p>
                        </div>
                      </div>
                    );
                  })}
               </div>

               <Button className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl h-10 group shadow-lg shadow-emerald-500/10 transition-all">
                  Next Milestone
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </Card>

            <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] p-6 rounded-3xl border-dashed">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Project Insights</h3>
               <div className="p-4 bg-[var(--bg-raised)] rounded-2xl border border-[var(--border-subtle)]">
                  <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">
                    AI suggests transitioning to <span className="font-bold text-[var(--text-primary)] underline decoration-[var(--accent)] underline-offset-4">Construction</span> documentation by early next month based on current file velocity.
                  </p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
