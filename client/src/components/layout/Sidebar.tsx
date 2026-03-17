import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Bell, 
  Settings,
  PlusCircle,
  LogOut
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProjects } from '../../hooks/use-projects';
import { useAuth } from '../../hooks/use-auth';
import { useProjectModal } from '../../store/use-project-modal';
import { useState } from 'react';
import { useProjectFiles } from '../../hooks/use-project-files';
import { FileIcon, ImageIcon, VideoIcon, FileJson } from 'lucide-react';

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
];

const statusColors: Record<string, string> = {
  draft: '#94a3b8',
  active: '#10b981',
  on_hold: '#f59e0b',
  completed: '#3b82f6',
};

export function Sidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const location = useLocation();
  const { user } = useAuth();
  const { openModal } = useProjectModal();
  const { data: projects, isLoading } = useProjects();
  
  const sidebarProjects = projects?.slice(0, 5) || [];
  const recentFiles = projects?.slice(0, 3).map(p => ({ id: p.id, name: p.name, type: 'project' })) || [];

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

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between px-4 mb-2">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-tertiary)]">
              PROJECTS
            </div>
            {sidebarProjects.length > 0 && (
              <Link to="/projects" className="text-[9px] font-bold text-[var(--accent)] hover:underline uppercase tracking-tighter">
                View All
              </Link>
            )}
          </div>
          <div className="px-2 flex flex-col gap-0.5">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-8 w-full bg-slate-50 animate-pulse rounded-lg mx-2" />
              ))
            ) : sidebarProjects.length > 0 ? (
              sidebarProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center w-full h-[32px] px-2 rounded-lg text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors text-left"
                >
                  <div 
                    className="w-[6px] h-[6px] rounded-full mr-2 shrink-0" 
                    style={{ backgroundColor: statusColors[project.status] }}
                  />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))
            ) : (
              <div className="px-4 py-2">
                <p className="text-[10px] text-[var(--text-tertiary)] italic">No active projects</p>
                <button 
                  onClick={openModal}
                  className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-[var(--accent)] hover:opacity-80 transition-opacity"
                >
                  <PlusCircle className="w-3 h-3" />
                  Create project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Section */}
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] px-4 mb-2">
            RECENT ACTIVITY
          </div>
          <div className="px-2 flex flex-col gap-0.5">
            {recentFiles.map((file) => (
              <Link
                key={file.id}
                to={`/projects/${file.id}/files`}
                className="flex items-center w-full h-[32px] px-2 rounded-lg text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors group"
              >
                <div className="w-[14px] h-[14px] mr-2 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors">
                  <FileIcon className="w-full h-full" />
                </div>
                <span className="truncate flex-1">{file.name} Assets</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom User Row */}
      <div className="mt-auto p-2.5 border-t border-[var(--border-subtle)] flex items-center gap-2 shrink-0">
        <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[12px] font-medium text-[var(--text-primary)] truncate">
            {user?.email?.split('@')[0] || 'Studio User'}
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)] truncate">
            {user ? 'Admin' : 'Studio Access'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onOpenSettings}
            className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors shrink-0 outline-none"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-6 h-6 rounded-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
