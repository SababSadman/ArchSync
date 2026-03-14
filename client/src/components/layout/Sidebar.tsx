import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Bell, 
  Settings 
} from 'lucide-react';

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
];

const recentProjects = [
  { name: 'Meridian Tower', color: '#7C3AED' },
  { name: 'Lakeside Villa', color: '#1F6FEB' },
  { name: 'Downtown Hub', color: '#D97706' },
  { name: 'Eco Residency', color: '#16A34A' },
  { name: 'Nexus Plaza', color: '#7C3AED' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-[232px] h-full bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] shrink-0">
      {/* Top Section */}
      <div className="flex items-center h-[56px] px-4 border-b border-[var(--border-subtle)] shrink-0 gap-3">
        <div className="w-[26px] h-[26px] rounded-md bg-[#1A1916] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
          AS
        </div>
        <span className="text-[13px] font-medium text-[var(--text-primary)]">
          ArchSync
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">
        {/* Main Nav */}
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] px-4 mb-2">
            MAIN
          </div>
          <nav className="px-2 flex flex-col gap-0.5">
            {mainNav.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center h-[36px] px-2 rounded-lg text-[13px] transition-colors relative ${
                    isActive
                      ? 'bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[var(--accent)] rounded-r-md" />
                  )}
                  <item.icon className="w-[15px] h-[15px] mr-2 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-subtle)] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] px-4 mb-2">
            PROJECTS
          </div>
          <div className="px-2 flex flex-col gap-0.5">
            {recentProjects.map((project, i) => (
              <button
                key={i}
                className="flex items-center w-full h-[32px] px-2 rounded-lg text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors text-left"
              >
                <div 
                  className="w-[6px] h-[6px] rounded-full mr-2 shrink-0" 
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom User Row */}
      <div className="mt-auto p-2.5 border-t border-[var(--border-subtle)] flex items-center gap-2 shrink-0">
        <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#DB2777] shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[12px] font-medium text-[var(--text-primary)] truncate">
            Nadia Rahman
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)] truncate">
            Owner
          </span>
        </div>
        <button className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors shrink-0">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
