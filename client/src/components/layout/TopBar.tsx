import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/use-projects';
import { useAuth } from '../../hooks/use-auth';
import { cn } from '../../lib/utils';

export function TopBar() {
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: projects } = useProjects();

  const currentProject = projects?.find(p => p.id === id);
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const getBreadcrumbs = () => {
    if (pathSegments.length === 0) return <span>Dashboard</span>;
    
    return pathSegments.map((segment, idx) => {
      const isLast = idx === pathSegments.length - 1;
      const label = id && segment === id ? (currentProject?.name || 'Project') : segment.replace(/-/g, ' ');
      
      return (
        <React.Fragment key={segment}>
          {idx > 0 && <span className="mx-2.5 text-[var(--text-tertiary)] font-light italic">/</span>}
          <span className={cn(
            "capitalize transition-colors",
            isLast ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}>
            {label}
          </span>
        </React.Fragment>
      );
    });
  };

  return (
    <header className="h-[52px] bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
      {/* Breadcrumb Left */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[var(--text-secondary)] -ml-1 p-1">
          <Menu className="w-5 h-5" />
        </button>
        
        <nav className="flex items-center text-[12px] font-normal tracking-tight">
          {getBreadcrumbs()}
        </nav>
      </div>

      {/* Actions Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="w-8 h-8 flex items-center justify-center border border-[var(--border-default)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-all">
          <Search className="w-3.5 h-3.5" />
        </button>
        
        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center border border-[var(--border-default)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-all">
          <Bell className="w-3.5 h-3.5" />
          <div className="absolute top-[7px] right-[7px] w-1.5 h-1.5 bg-[#DC2626] rounded-full border border-[var(--bg-surface)]" />
        </button>

        <div className="w-[1px] h-6 bg-[var(--border-subtle)] mx-1" />

        {/* Presence / User */}
        <div className="flex items-center gap-2.5 pl-1.5">
          <div className="flex -space-x-[7px]">
            <div className="w-[28px] h-[28px] rounded-full bg-emerald-100 flex items-center justify-center border-2 border-[var(--bg-surface)] z-10 shadow-sm overflow-hidden text-[9px] font-black text-emerald-700">JS</div>
            <div className="w-[28px] h-[28px] rounded-full bg-indigo-100 flex items-center justify-center border-2 border-[var(--bg-surface)] z-0 shadow-sm overflow-hidden text-[9px] font-black text-indigo-700">ML</div>
          </div>
          
          <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#1F6FEB] flex items-center justify-center text-[10px] font-black text-white shadow-md ring-2 ring-[var(--bg-surface)] cursor-pointer hover:scale-105 transition-transform">
            {user?.email?.[0].toUpperCase() || 'AK'}
          </div>
        </div>
      </div>
    </header>
  );
}
