import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCreateProject } from '../../hooks/use-projects';
import { addMonths } from 'date-fns';
import { ProjectPhase, ProjectType } from '../../types/project';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const phases: { value: ProjectPhase; label: string; desc: string }[] = [
  { value: 'schematic', label: 'Schematic', desc: 'Concept development and site analysis' },
  { value: 'design_dev', label: 'Design Dev', desc: 'Refining details and materials' },
  { value: 'construction', label: 'Construction', desc: 'Permit and construction blueprints' },
  { value: 'closeout', label: 'Closeout', desc: 'Project completion and handover' },
];

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState<ProjectPhase>('schematic');
  const [projectType, setProjectType] = useState<ProjectType>('residential');
  const [deadline, setDeadline] = useState<Date | undefined>(addMonths(new Date(), 3));
  const [calendarOpen, setCalendarOpen] = useState(false);

  const createMutation = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadline) {
      alert('Please set a deadline before launching the project.');
      return;
    }
    createMutation.mutate({
      name,
      description,
      phase,
      project_type: projectType,
      deadline: deadline.toISOString(),
      status: 'active',
    }, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
      onError: (err: any) => {
        console.error('Project creation failed:', err);
        alert(`Failed to launch project: ${err.message || 'Unknown error'}`);
      }
    });
  };

  const reset = () => {
    setName('');
    setDescription('');
    setPhase('schematic');
    setProjectType('residential');
    setDeadline(addMonths(new Date(), 3));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-[var(--bg-surface)] border-[var(--border-subtle)] p-0 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent)] to-blue-600" />
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Create New Project</DialogTitle>
            <DialogDescription className="text-[var(--text-tertiary)] font-medium">
              Initialize a new architecture project in your studio portfolio.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Meridian Tower"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[var(--bg-surface)] border-[var(--border-default)] h-11 focus-visible:ring-[var(--accent)] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
              Current Phase
            </label>
            <Select value={phase} onValueChange={(v) => setPhase(v as ProjectPhase)}>
              <SelectTrigger className="bg-[var(--bg-surface)] border-[var(--border-default)] h-11">
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="py-3">
                    <div className="flex flex-col text-left gap-0.5">
                      <span className="font-bold text-sm">{p.label}</span>
                      <span className="text-[11px] text-[var(--text-tertiary)]">{p.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)] mt-2 px-1">
              <Info className="w-4 h-4 text-[var(--accent)]" />
              <span className="italic leading-snug">{phases.find(p => p.value === phase)?.desc}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                Project Type
              </label>
              <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
                <SelectTrigger className="bg-[var(--bg-surface)] border-[var(--border-default)] h-11">
                  <SelectValue placeholder="Project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="mixed-use">Mixed-use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                Deadline
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-medium bg-[var(--bg-surface)] border-[var(--border-default)] h-11 transition-all hover:border-[var(--accent)] px-4"
                    )}
                  >
                    <CalendarIcon className="h-5 w-5 text-[var(--accent)] mr-3 shrink-0" />
                    {deadline ? (
                      <span className="text-sm font-bold truncate">{format(deadline, "PPP")}</span>
                    ) : (
                      <span className="text-sm text-[var(--text-tertiary)]">Select deadline...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 flex flex-col shadow-2xl border-[var(--border-subtle)]" align="start" sideOffset={8}>
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={(date) => {
                      setDeadline(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    className="p-3 bg-[var(--bg-surface)]"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-1.5 pb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
              Description (Optional)
            </label>
            <Input
              placeholder="e.g. Concept design for a 12-story commercial tower."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[var(--bg-surface)] border-[var(--border-default)] h-11 focus-visible:ring-[var(--accent)]"
            />
          </div>

          <DialogFooter className="px-6 py-6 bg-[var(--bg-base)] border-t border-[var(--border-subtle)] gap-3 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold px-8 shadow-lg shadow-[var(--accent)]/20"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Initializing...' : 'Launch Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
