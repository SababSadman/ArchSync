import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import { Comment } from '../../hooks/use-comments';

interface CommentPinProps {
  comment: Comment;
  isSelected?: boolean;
  onClick: (id: string) => void;
}

export function CommentPin({ comment, isSelected, onClick }: CommentPinProps) {
  const statusColors = {
    open: 'bg-yellow-400 border-yellow-500 text-yellow-950',
    in_progress: 'bg-blue-400 border-blue-500 text-blue-950',
    resolved: 'bg-emerald-400 border-emerald-500 text-emerald-950',
    needs_action: 'bg-red-400 border-red-500 text-red-950',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onClick(comment.id)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 shadow-lg flex items-center justify-center text-[10px] font-black transition-all hover:scale-125 z-20 pointer-events-auto",
              statusColors[comment.status] || statusColors.open,
              isSelected && "ring-4 ring-white ring-offset-2 ring-offset-slate-900 scale-125 z-30 animate-pulse"
            )}
            style={{ left: `${comment.x_percent}%`, top: `${comment.y_percent}%` }}
          >
            {/* Logic for number would go here, but for now we'll just show status icon or placeholder */}
            {comment.status === 'resolved' ? '✓' : '!'}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px] p-2 bg-slate-900 border-slate-800 text-white shadow-2xl">
          <p className="text-xs font-semibold line-clamp-2">{comment.content}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">
            {comment.author?.full_name || 'User'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
