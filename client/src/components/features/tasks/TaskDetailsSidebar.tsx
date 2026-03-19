import React from 'react';
import { 
  X, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  FileText, 
  Repeat, 
  AlignLeft, 
  MessageSquare,
  Send,
  Paperclip,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useNotifications } from '../../../hooks/use-notifications';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Calendar } from '../../ui/calendar';
import { format } from 'date-fns';

type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  fileName?: string;
  status: TaskStatus;
  priority: TaskPriority;
  phase: string;
  dueDate: string;
  assignee: { name: string; initials: string; avatarUrl?: string };
  isRecurring?: boolean;
  description?: string;
  comments?: Array<{
    id: string;
    author: { name: string; initials: string; avatarUrl?: string };
    content: string;
    timestamp: string;
  }>;
}

interface TaskDetailsSidebarProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  members: any[];
  currentUser?: { name: string; initials: string; avatarUrl?: string };
}

export function TaskDetailsSidebar({ task, isOpen, onClose, onUpdateTask, members, currentUser }: TaskDetailsSidebarProps) {
  const [newComment, setNewComment] = React.useState('');
  const addNotification = useNotifications(state => state.addNotification);

  if (!task) return null;

  const handleStatusChange = (status: TaskStatus) => {
    onUpdateTask({ ...task, status });
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    onUpdateTask({ ...task, priority });
  };

  const handlePhaseChange = (phase: string) => {
    onUpdateTask({ ...task, phase });
  };

  const handleAssigneeChange = (memberName: string) => {
    const member = members.find(m => m.full_name === memberName);
    if (member) {
      onUpdateTask({ 
        ...task, 
        assignee: { 
          name: member.full_name, 
          initials: member.full_name.split(' ').map((n: string) => n[0]).join(''),
          avatarUrl: member.avatar_url 
        } 
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateTask({ ...task, description: e.target.value });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser || { name: 'Ana Kim', initials: 'AK' },
      content: newComment,
      timestamp: 'Just now'
    };

    onUpdateTask({
      ...task,
      comments: [...(task.comments || []), comment]
    });

    // Detect @ mentions
    if (newComment.includes('@')) {
      const mentionedName = newComment.split('@')[1].split(' ')[0];
      addNotification({
        type: 'mention',
        author: currentUser?.name || 'Ana Kim',
        title: `${currentUser?.name || 'Ana Kim'} mentioned you`,
        subtitle: `"${newComment}"`,
        projectId: task.projectId
      });
    }

    setNewComment('');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] bg-white sticky top-0 z-10">
          <h2 className="font-serif text-[20px] italic text-[var(--text-primary)] leading-tight flex-1 pr-4">
            {task.title}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-raised)] text-[var(--text-tertiary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Status, Priority, Phase Row */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                  Status
                </Label>
                <Select value={task.status} onValueChange={(val) => handleStatusChange(val as TaskStatus)}>
                  <SelectTrigger className="h-11 border-[var(--border-default)] rounded-xl bg-[var(--bg-raised)]/30">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                    Priority
                  </Label>
                  <Select value={task.priority} onValueChange={(val) => handlePriorityChange(val as TaskPriority)}>
                    <SelectTrigger className="h-11 border-[var(--border-default)] rounded-xl bg-[var(--bg-raised)]/30">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                    Phase
                  </Label>
                  <Select value={task.phase} onValueChange={handlePhaseChange}>
                    <SelectTrigger className="h-11 border-[var(--border-default)] rounded-xl bg-[var(--bg-raised)]/30">
                      <SelectValue placeholder="Select Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Schematic Design">Schematic Design</SelectItem>
                      <SelectItem value="Design Dev">Design Dev</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Bid Set">Bid Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                Assignee
              </Label>
              <Select value={task.assignee.name} onValueChange={handleAssigneeChange}>
                <SelectTrigger className="h-11 border-[var(--border-default)] rounded-xl bg-[var(--bg-raised)]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[var(--bg-raised)] flex items-center justify-center text-[8px] font-black border border-[var(--border-subtle)]">
                      {task.assignee.initials}
                    </div>
                    <span>{task.assignee.name}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.full_name}>
                       <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[var(--bg-raised)] flex items-center justify-center text-[8px] font-black border border-[var(--border-subtle)]">
                          {member.full_name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span>{member.full_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal border-[var(--border-default)] rounded-xl bg-[var(--bg-raised)]/30",
                      !task.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[var(--accent)]" />
                    {task.dueDate ? task.dueDate : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => date && onUpdateTask({ ...task, dueDate: format(date, 'MMM dd, yyyy') })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Linked File */}
            {task.fileName && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                  Linked File
                </Label>
                <div className="p-3 bg-[var(--bg-raised)]/50 rounded-xl border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                      <Paperclip className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[var(--accent)] underline decoration-[var(--accent)]/30">{task.fileName}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">v2 • DWG Drawing</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recurring */}
            <div className="flex items-center gap-3 py-2 px-1">
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                task.isRecurring ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--border-default)]"
              )}
              onClick={() => onUpdateTask({ ...task, isRecurring: !task.isRecurring })}
              >
                {task.isRecurring && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <Label className="text-[12px] font-bold text-[var(--text-secondary)]">Weekly recurring task</Label>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                Description
              </Label>
              <Textarea 
                placeholder="Add a more detailed description..."
                className="min-h-[120px] border-[var(--border-default)] rounded-xl bg-[var(--bg-raised)]/30 resize-none p-4 text-[14px]"
                value={task.description || ''}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1 mb-6 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Comments
            </h3>
            
            <div className="space-y-6 mb-8">
              {task.comments?.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[10px] font-black text-white shrink-0">
                    {comment.author.initials}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[var(--text-primary)]">{comment.author.name}</span>
                      <span className="text-[10px] font-medium text-[var(--text-tertiary)]">{comment.timestamp}</span>
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <Textarea 
                placeholder="Add a comment..." 
                className="min-h-[100px] border-[var(--border-default)] rounded-xl bg-[var(--bg-raised)]/30 resize-none pr-12 pt-4 pl-4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <button 
                onClick={handleAddComment}
                className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-[var(--text-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
