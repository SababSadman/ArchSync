import { Search, Bell, Menu } from 'lucide-react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/use-projects';
import { useAuth } from '../../hooks/use-auth';

export function TopBar() {
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: projects } = useProjects();

  const currentProject = projects?.find(p => p.id === id);
  const isProjectDetail = location.pathname.startsWith('/projects/') && id;

  return (
    <header className="h-[54px] bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-10 shadow-sm">
      
      {/* Left side: Mobile menu toggle + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <Menu className="w-5 h-5" />
        </button>
        
        <nav className="flex items-center text-[12px] font-medium">
          <Link to="/projects" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Portfolio
          </Link>
          {isProjectDetail && (
            <>
              <span className="text-[var(--text-tertiary)] mx-2">/</span>
              <span className="text-[var(--text-primary)] font-bold tracking-tight">
                {currentProject?.name || 'Project Details'}
              </span>
            </>
          )}
          {!isProjectDetail && location.pathname !== '/projects' && (
            <>
              <span className="text-[var(--text-tertiary)] mx-2">/</span>
              <span className="text-[var(--text-primary)] font-bold tracking-tight capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ')}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 mr-2">
           <button className="w-[32px] h-[32px] flex items-center justify-center border border-[var(--border-default)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:border-[var(--accent)] transition-all">
            <Search className="w-4 h-4" />
          </button>
          
          <button className="relative w-[32px] h-[32px] flex items-center justify-center border border-[var(--border-default)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:border-[var(--accent)] transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-surface)]"></span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-[var(--border-subtle)] mx-1 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">
              {user?.email?.split('@')[0] || 'Studio User'}
            </span>
            <span className="text-[9px] text-[var(--text-tertiary)] font-bold uppercase tracking-tighter">
              {user ? 'Architect' : 'Member'}
            </span>
          </div>
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-[var(--accent)]/10 ring-2 ring-[var(--bg-surface)]">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>

    </header>
  );
}
