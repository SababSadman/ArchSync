import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCreateProject } from '../../hooks/use-projects';
import { ProjectPhase, ProjectType } from '../../types/project';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const phases: { value: ProjectPhase; label: string; desc: string }[] = [
  { value: 'schematic', label: 'Schematic', desc: 'Concept development and site analysis' },
  { value: 'design_dev', label: 'Design Dev', desc: 'Refining details and materials' },
  { value: 'construction_docs', label: 'Construction Docs', desc: 'Permit and construction blueprints' },
  { value: 'closeout', label: 'Closeout', desc: 'Project completion and handover' },
];

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState<ProjectPhase>('schematic');
  const [projectType, setProjectType] = useState<ProjectType>('residential');
  const [deadline, setDeadline] = useState('');

  const createMutation = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      description,
      phase,
      project_type: projectType,
      deadline: deadline || undefined,
      status: 'active',
    }, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
    });
  };

  const reset = () => {
    setName('');
    setDescription('');
    setPhase('schematic');
    setProjectType('residential');
    setDeadline('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[var(--bg-surface)] border-[var(--border-subtle)]" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[var(--text-primary)]">New Project</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Create a new architecture studio project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Project Name
            </label>
            <Input
              required
              placeholder="e.g. Meridian Tower"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[var(--bg-surface)] border-[var(--border-default)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Phase
            </label>
            <Select value={phase} onValueChange={(v) => setPhase(v as ProjectPhase)}>
              <SelectTrigger className="bg-[var(--bg-surface)] border-[var(--border-default)]">
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{p.label}</span>
                      <span className="text-[10px] text-gray-500">{p.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Type
              </label>
              <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
                <SelectTrigger className="bg-[var(--bg-surface)] border-[var(--border-default)]">
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
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Deadline
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-[var(--bg-surface)] border-[var(--border-default)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Description (Optional)
            </label>
            <Input
              placeholder="Brief overview..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[var(--bg-surface)] border-[var(--border-default)]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[var(--border-default)]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-6"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
