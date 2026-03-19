import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import { CheckCircle2, Layout, FileText, Settings, Hammer } from 'lucide-react';

interface TaskTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: string) => void;
}

const TEMPLATES = [
  {
    id: 'schematic',
    title: 'Schematic Design',
    description: '8 standard tasks • concept through client sign-off',
    count: 8,
    icon: Layout,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    badgeColor: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'design-dev',
    title: 'Design Development',
    description: '12 standard tasks • documentation and coordination',
    count: 12,
    icon: FileText,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'construction',
    title: 'Construction Documents',
    description: '15 standard tasks • permit-ready set',
    count: 15,
    icon: Hammer,
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    badgeColor: 'bg-orange-100 text-orange-700'
  },
  {
    id: 'closeout',
    title: 'Project Closeout',
    description: '6 standard tasks • as-built documentation',
    count: 6,
    icon: Settings,
    color: 'bg-green-50 text-green-600 border-green-100',
    badgeColor: 'bg-green-100 text-green-700'
  }
];

export function TaskTemplatesModal({ open, onOpenChange, onSelectTemplate }: TaskTemplatesModalProps) {
  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange}
      title="Task Templates"
      description="Pre-built task sets for each project phase. Selecting a template will add all tasks to the board."
    >
      <div className="space-y-4 py-4">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              onSelectTemplate(template.id);
              onOpenChange(false);
            }}
            className="w-full text-left p-4 rounded-xl border border-[var(--border-default)] hover:border-[var(--accent)] hover:shadow-md transition-all group flex items-start gap-4 relative overflow-hidden"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", template.color)}>
              <template.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-serif text-[16px] italic text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                  {template.title}
                </h4>
                <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded", template.badgeColor)}>
                  {template.count} tasks
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-tertiary)] font-medium truncate">
                {template.description}
              </p>
            </div>
            
            {/* Hover Indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </button>
        ))}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-8 h-11">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
