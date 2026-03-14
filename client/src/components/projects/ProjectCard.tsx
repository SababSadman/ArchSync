import { Project } from '../../types/project';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow, isBefore } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-300',
  active: 'bg-green-500',
  on_hold: 'bg-amber-500',
  completed: 'bg-blue-500',
};

const phaseLabel: Record<string, string> = {
  schematic: 'Schematic',
  design_dev: 'Design Dev',
  construction_docs: 'Construction Docs',
  closeout: 'Closeout',
};

const phaseColors: Record<string, string> = {
  schematic: 'bg-purple-100 text-purple-700',
  design_dev: 'bg-blue-100 text-blue-700',
  construction_docs: 'bg-orange-100 text-orange-700',
  closeout: 'bg-green-100 text-green-700',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const isOverdue = project.deadline && isBefore(new Date(project.deadline), new Date()) && project.status !== 'completed';

  return (
    <Card className="overflow-hidden bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow">
      {/* Cover Image */}
      <div className="aspect-video w-full relative bg-gradient-to-br from-slate-100 to-slate-200">
        {project.cover_image_url ? (
          <img 
            src={project.cover_image_url} 
            alt={project.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <div className="w-12 h-12 rounded-full border-4 border-slate-400 border-dashed" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColors[project.status]}`} />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            {project.status}
          </span>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-base font-semibold text-[var(--text-primary)] leading-tight truncate">
            {project.name}
          </h4>
        </div>
        
        <Badge className={`mb-4 px-2 py-0 h-5 text-[10px] font-semibold border-none rounded-md ${phaseColors[project.phase]}`}>
          {phaseLabel[project.phase]}
        </Badge>

        <div className="flex flex-col gap-2 mb-4">
          <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-[var(--text-tertiary)]'}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {project.deadline ? `Deadline ${new Date(project.deadline).toLocaleDateString()}` : 'No deadline'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-[var(--border-subtle)] mt-auto h-[53px]">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((_, i) => (
            <Avatar key={i} className="w-6 h-6 border-2 border-[var(--bg-surface)]">
              <AvatarFallback className="text-[9px]">U{i}</AvatarFallback>
            </Avatar>
          ))}
          <div className="w-6 h-6 rounded-full bg-[var(--bg-raised)] border-2 border-[var(--bg-surface)] flex items-center justify-center text-[9px] font-medium text-[var(--text-tertiary)]">
            +4
          </div>
        </div>
        <button className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
          View details
        </button>
      </CardFooter>
    </Card>
  );
}
