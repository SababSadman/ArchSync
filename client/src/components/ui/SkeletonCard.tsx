export function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-20 bg-[var(--bg-sunken)] w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[var(--bg-sunken)] rounded-md w-3/4" />
        <div className="h-3 bg-[var(--bg-sunken)] rounded-md w-1/2" />
        <div className="pt-4 flex items-center justify-between">
          <div className="h-4 bg-[var(--bg-sunken)] rounded-full w-20" />
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-[var(--bg-sunken)] border-2 border-[var(--bg-surface)]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
