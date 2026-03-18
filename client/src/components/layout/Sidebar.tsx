import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Bell, 
  Sparkles,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProjects } from '../../hooks/use-projects';
import { useAuth } from '../../hooks/use-auth';
import { useNotifications } from '../../hooks/use-notifications';

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'All Projects', href: '/projects', icon: FolderOpen },
  { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'AI Assistant', href: '/ai', icon: Sparkles },
];

const projectColors = ['#7C3AED', '#1F6FEB', '#D97706', '#16A34A', '#7C3AED'];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { data: projects } = useProjects();
  const notifications = useNotifications(state => state.notifications);
  
  const unreadCount = notifications.filter(n => n.isUnread).length;
  const recentProjects = projects?.slice(0, 5) || [];

  return (
    <aside className="w-[232px] flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] shrink-0 z-30">
      {/* Logo Area */}
      <div className="h-[56px] px-4 flex items-center border-b border-[var(--border-subtle)] gap-2.5">
        <div className="w-7 h-7 rounded-md bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <span className="font-serif text-white text-[15px] font-bold">A</span>
        </div>
        <div className="flex items-baseline font-serif text-[17px] tracking-tight">
          <span className="text-[var(--text-primary)]">Arch</span>
          <span className="text-[var(--accent)]">Sync</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 pb-2">
        {/* Main Nav */}
        <section className="mb-6">
          <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] px-4 mb-2">
            Main
          </div>
          <nav className="flex flex-col gap-0.5">
            {mainNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center h-9 mx-1.5 px-3 rounded-[7px] text-[13px] font-medium transition-all group",
                    isActive 
                      ? "bg-[var(--accent-subtle)] text-[var(--accent)]" 
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <item.icon className={cn(
                    "w-[15px] h-[15px] mr-3 shrink-0 transition-colors",
                    isActive ? "text-[var(--accent)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                  )} />
                  <span className="flex-1">{item.name}</span>
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <div className="bg-[#DC2626] text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </section>

        {/* Projects List */}
        <section className="mb-6">
          <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] px-4 mb-2">
            Projects
          </div>
          <div className="flex flex-col gap-0.5">
            {recentProjects.map((project, idx) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center h-8 mx-1.5 px-3 rounded-[7px] text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-all group"
              >
                <div 
                  className="w-[7px] h-[7px] rounded-full mr-3 shrink-0" 
                  style={{ backgroundColor: projectColors[idx % projectColors.length] }}
                />
                <span className="truncate flex-1 font-medium">{project.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Settings & User */}
      <div className="mt-auto">
        <Link
          to="/settings"
          className={cn(
            "flex items-center h-9 mx-1.5 mb-1 px-3 rounded-[7px] text-[13px] font-medium transition-all",
            location.pathname.startsWith('/settings') 
              ? "bg-[var(--bg-raised)] text-[var(--text-primary)]" 
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]"
          )}
        >
          <Settings className="w-[15px] h-[15px] mr-3 text-[var(--text-tertiary)]" />
          <span>Settings</span>
        </Link>

        <div className="h-[52px] border-top border-[var(--border-subtle)] border-t flex items-center px-3.5 gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#1F6FEB] flex items-center justify-center text-[10px] font-black text-white shrink-0 border border-white/10 shadow-sm">
            {user?.email?.[0].toUpperCase() || 'AK'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-semibold text-[var(--text-primary)] leading-none truncate">
              {user?.email?.split('@')[0] || 'Ana Kim'}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] mt-1 truncate">
              Admin · Studio Meridian
            </span>
          </div>
          <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
