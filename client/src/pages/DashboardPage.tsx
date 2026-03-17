import { 
  LayoutDashboard, 
  Briefcase, 
  Clock, 
  Users, 
  ArrowUpRight, 
  FileText, 
  Plus, 
  MessageSquare 
} from 'lucide-react';
import { useProjects } from '../hooks/use-projects';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const recentProjects = projects.slice(0, 3);

  const stats = [
    { label: 'Active Projects', value: activeProjects.length, icon: Briefcase, color: 'text-emerald-500' },
    { label: 'Total Files', value: '124', icon: FileText, color: 'text-blue-500' },
    { label: 'Team Members', value: '12', icon: Users, color: 'text-violet-500' },
    { label: 'Avg. Progress', value: '64%', icon: ArrowUpRight, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Welcome back, {user?.email?.split('@')[0] || 'Architect'}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium italic">
            "Design is a solution to a problem. Art is a question to a problem." — John Maeda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 px-4 gap-2 border-[var(--border-default)]">
             <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
             <span className="text-xs font-bold uppercase tracking-widest">{format(new Date(), 'MMM dd, HH:mm')}</span>
          </Button>
          <Button className="h-10 px-6 gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] font-bold shadow-lg shadow-[var(--accent)]/20">
             <Plus className="w-4 h-4" />
             New Asset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[var(--bg-surface)] border-[var(--border-subtle)] overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-4 opacity-5 ${stat.color}`}>
              <stat.icon className="w-16 h-16" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-900 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">{stat.label}</span>
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)]">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-emerald-500" />
              Recent Studio Activity
            </h3>
            <Link to="/projects" className="text-xs font-bold text-[var(--accent)] hover:underline uppercase tracking-widest">View All Projects</Link>
          </div>
          
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent)]/50 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-black text-[var(--accent)] text-lg group-hover:scale-110 transition-transform">
                    {project.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm truncate">{project.name}</h4>
                      <Badge variant="outline" className="text-[9px] py-0 h-4 bg-slate-100 dark:bg-slate-900">
                        {project.phase.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[var(--text-tertiary)] truncate italic">{project.description || 'No project brief provided.'}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                     <span className="text-[9px] text-[var(--text-tertiary)] font-mono">{format(new Date(project.updated_at), 'MMM dd')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions & Mentions */}
        <div className="space-y-6">
           <Card className="bg-slate-950 border-white/5 text-white overflow-hidden">
             <div className="h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Quick Actions</CardTitle>
                <CardDescription className="text-[10px] text-slate-500 italic leading-tight">One-click studio operations</CardDescription>
             </CardHeader>
             <CardContent className="space-y-2 p-4">
                <Button className="w-full justify-start gap-3 h-10 bg-white/5 hover:bg-white/10 text-xs font-bold border border-white/5 rounded-xl transition-all hover:translate-x-1">
                   <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                      <Plus className="w-3.5 h-3.5 text-emerald-500" />
                   </div>
                   Add Project Member
                </Button>
                <Button className="w-full justify-start gap-3 h-10 bg-white/5 hover:bg-white/10 text-xs font-bold border border-white/5 rounded-xl transition-all hover:translate-x-1">
                   <div className="p-1.5 bg-blue-500/20 rounded-lg">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                   </div>
                   Broadcast Announcement
                </Button>
             </CardContent>
           </Card>

           <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center justify-between">
                   Recent Mentions
                   <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none rounded-full h-5 min-w-[20px] px-1.5 font-bold">2</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[1, 2].map(i => (
                    <div key={i} className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 shrink-0" />
                       <div className="space-y-1 min-w-0">
                          <p className="text-[11px] leading-snug">
                            <span className="font-bold">Ana</span> mentioned you in <span className="font-bold text-[var(--accent)] underline underline-offset-2">Main Elevation</span>
                          </p>
                          <p className="text-[9px] text-[var(--text-tertiary)] font-italic">"Check the window height on floor 3..."</p>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
