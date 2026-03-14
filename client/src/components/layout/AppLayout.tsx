import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-surface)] text-[var(--text-primary)] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-[var(--bg-base)]">
          <div className="px-[32px] py-[28px] mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
