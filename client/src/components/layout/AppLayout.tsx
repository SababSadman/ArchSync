import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-surface)] text-[var(--text-primary)] font-sans antialiased">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Flow */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[var(--bg-base)]">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] h-full px-8 py-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
