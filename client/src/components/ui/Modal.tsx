import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from './dialog';
import { cn } from '../../lib/utils';

interface ModalProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function Modal({ 
  title, 
  description, 
  children, 
  footer, 
  open, 
  onOpenChange,
  className 
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[480px] bg-[var(--bg-surface)] border-[var(--border-subtle)] p-0 gap-0 overflow-hidden rounded-2xl", className)}>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-serif text-2xl text-[var(--text-primary)] italic">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-[var(--text-secondary)] font-medium">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="p-6 py-2">
          {children}
        </div>

        {footer && (
          <DialogFooter className="p-6 bg-[var(--bg-raised)] border-t border-[var(--border-subtle)]">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
