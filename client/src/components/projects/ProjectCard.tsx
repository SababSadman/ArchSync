import { Project } from '../../types/project';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar as CalendarIcon, Clock, Users, Trash2 } from 'lucide-react';
import { formatDistanceToNow, isBefore, differenceInDays } from 'date-fns';
import { useDeleteProject } from '../../hooks/use-projects';
import { Button } from '../ui/button';
import { useState } from 'react';
import { TeamDialog } from './TeamDialog';
import { useProjectMembers } from '../../hooks/use-members';

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-400',
  active: 'bg-emerald-500',
  on_hold: 'bg-amber-500',
  completed: 'bg-blue-500',
};

const phaseLabel: Record<string, string> = {
  schematic: 'Schematic Design',
  design_dev: 'Design Development',
  construction: 'Construction',
  closeout: 'Project Closeout',
};

const phaseColors: Record<string, string> = {
  schematic: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  design_dev: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  construction: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  closeout: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const deleteMutation = useDeleteProject();
  const { data: members = [] } = useProjectMembers(project.id);
  const deadlineDate = project.deadline ? new Date(project.deadline) : null;
  const isOverdue = deadlineDate && isBefore(deadlineDate, new Date()) && project.status !== 'completed';
  const daysLeft = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;
  
  const getUrgencyColor = () => {
    if (isOverdue) return 'text-red-500 font-bold';
    if (daysLeft !== null && daysLeft < 7) return 'text-orange-500 font-semibold';
    return 'text-[var(--text-tertiary)]';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(project.id);
    }
  };

  const maxAvatars = 4;
  const displayedMembers = (members || []).slice(0, maxAvatars);
  const remainingCount = Math.max(0, (members || []).length - maxAvatars);

  return (
    <Card className="group overflow-hidden bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border-t-2 border-t-transparent hover:border-t-[var(--accent)] relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Cover Image */}
      <div className="aspect-[16/9] w-full relative bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-950 overflow-hidden">
        {project.cover_image_url ? (
          <img 
            src={project.cover_image_url} 
            alt={project.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-indigo-600 opacity-20" />
        )}
        
        {/* Status Indicator Dot */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
          <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${statusColors[project.status]} ${
            project.status === 'active' ? 'shadow-emerald-500/50' : 
            project.status === 'on_hold' ? 'shadow-amber-500/50' : 
            'shadow-gray-500/50'
          }`} />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            {project.status.replace('_', ' ')}
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
           <Badge className={`px-2.5 py-0.5 text-[10px] font-bold border-none rounded-md shadow-lg ${phaseColors[project.phase]}`}>
            {phaseLabel[project.phase]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <h4 className="text-lg font-bold text-[var(--text-primary)] leading-snug tracking-tight group-hover:text-[var(--accent)] transition-colors mb-2">
          {project.name}
        </h4>
        
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed italic">
          {project.description || 'No description provided for this architectural project.'}
        </p>

        <div className="mt-auto space-y-2.5">
          <div className={`flex items-center gap-2 text-xs transition-colors ${getUrgencyColor()}`}>
            <CalendarIcon className="w-4 h-4" />
            <span>
              {deadlineDate 
                ? `${isOverdue ? 'Overdue' : 'Due'} ${formatDistanceToNow(deadlineDate, { addSuffix: true })}` 
                : 'No deadline set'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <Clock className="w-4 h-4" />
            <span>
              Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-raised)]/50">
        <div className="flex -space-x-2">
          {displayedMembers.map((member, i) => (
            <Avatar key={member.user_id || i} className="w-7 h-7 border-2 border-[var(--bg-surface)] shadow-sm">
              <AvatarImage src={member.profile?.avatar_url || ''} />
              <AvatarFallback className="text-[9px] font-bold bg-slate-100 text-slate-600">
                {(member.profile?.full_name || 'U').split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <div className="w-7 h-7 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-subtle)] flex items-center justify-center text-[9px] font-bold text-[var(--text-secondary)] shadow-sm">
              +{remainingCount}
            </div>
          )}
        </div>
        
        <div 
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] cursor-pointer hover:underline"
          onClick={() => setTeamDialogOpen(true)}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team</span>
        </div>
      </CardFooter>

      <TeamDialog 
        projectId={project.id}
        projectName={project.name}
        createdBy={project.created_by}
        open={teamDialogOpen}
        onOpenChange={setTeamDialogOpen}
      />
    </Card>
  );
}
