import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-700">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-raised)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-[var(--text-tertiary)] opacity-60" />
      </div>
      <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-2 italic">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-8 font-medium">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}
