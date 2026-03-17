import { useState } from 'react';
import { Comment, useAddComment, useUpdateCommentStatus } from '../../hooks/use-comments';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { CheckCircle, MessageSquare, Send, X, CornerDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface CommentThreadProps {
  fileId: string;
  comments: Comment[];
  activeCommentId: string | null;
  onClose: () => void;
  projectName: string;
}

export function CommentThread({ fileId, comments, activeCommentId, onClose, projectName }: CommentThreadProps) {
  const [content, setContent] = useState('');
  const addComment = useAddComment();
  const updateStatus = useUpdateCommentStatus();

  const activeThread = comments.find(c => c.id === activeCommentId);
  if (!activeThread) return null;

  const replies = comments.filter(c => c.parent_id === activeCommentId || c.id === activeCommentId);

  const handleSend = async () => {
    if (!content.trim()) return;
    await addComment.mutateAsync({
      file_id: fileId,
      content,
      parent_id: activeCommentId,
      status: 'open',
    });
    setContent('');
  };

  return (
    <div className="w-80 h-full flex flex-col bg-slate-900 border-l border-white/5 shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          Comment Thread
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {replies.map((reply, idx) => (
          <div key={reply.id} className={cn("space-y-2", idx > 0 && "ml-4 pl-4 border-l border-white/5")}>
            <div className="flex items-center gap-3">
              <Avatar className="w-6 h-6 border border-white/10">
                <AvatarImage src={reply.author?.avatar_url} />
                <AvatarFallback className="text-[10px] bg-slate-800">
                  {reply.author?.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white truncate">
                    {reply.author?.full_name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {format(new Date(reply.created_at), 'HH:mm')}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {reply.content}
            </p>
            
            {idx === 0 && (
              <div className="flex items-center gap-2 pt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-6 px-2 text-[10px] font-bold gap-1",
                    reply.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-white/5"
                  )}
                  onClick={() => updateStatus.mutate({ id: reply.id, status: reply.status === 'resolved' ? 'open' : 'resolved', file_id: fileId })}
                >
                  <CheckCircle className="w-3 h-3" />
                  {reply.status === 'resolved' ? 'Resolved' : 'Resolve'}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-900/50">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[80px] text-xs bg-slate-800 border-white/5 text-white focus:ring-emerald-500/20 resize-none pr-10"
          />
          <Button 
            onClick={handleSend}
            disabled={!content.trim() || addComment.isPending}
            size="icon" 
            className="absolute bottom-2 right-2 h-7 w-7 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-[9px] text-slate-500 mt-2 text-center uppercase font-black tracking-widest">
          Type @ to mention team members
        </p>
      </div>
    </div>
  );
}
