import { Search, Bell, Menu } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-[52px] bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-10">
      
      {/* Left side: Mobile menu toggle + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center text-[13px]">
          <span className="text-[var(--text-secondary)]">Projects</span>
          <span className="text-[var(--text-tertiary)] mx-2">/</span>
          <span className="text-[var(--text-primary)] font-medium">Meridian Tower</span>
        </div>
      </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center gap-3">
        <button className="w-[30px] h-[30px] flex items-center justify-center border border-[var(--border-default)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors">
          <Search className="w-4 h-4" />
        </button>
        
        <button className="relative w-[30px] h-[30px] flex items-center justify-center border border-[var(--border-default)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-[5px] right-[6px] w-[5px] h-[5px] bg-[var(--accent)] rounded-full"></span>
        </button>

        <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#DB2777] ml-2 shrink-0" />
      </div>

    </header>
  );
}
