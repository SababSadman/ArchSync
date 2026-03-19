import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { useProjectMembers, ProjectMember } from '../../hooks/use-members';
import { useProjectFiles } from '../../hooks/use-project-files';
import { useNotifications } from '../../hooks/use-notifications';
import { 
  Plus, 
  UserPlus, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  X,
  FileText,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProjectTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

// Reuse some logic/types from TasksPage for consistency
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

const priorityColors = {
  critical: 'text-rose-600 bg-rose-50 border-rose-100',
  high: 'text-orange-600 bg-orange-50 border-orange-100',
  medium: 'text-amber-600 bg-amber-50 border-amber-100',
  low: 'text-slate-600 bg-slate-50 border-slate-100'
};

export function ProjectTasksModal({ open, onOpenChange, projectId, projectName }: ProjectTasksModalProps) {
  const { data: members } = useProjectMembers(projectId) as { data: ProjectMember[] | undefined };
  const { data: files } = useProjectFiles(projectId);
  const addNotification = useNotifications(state => state.addNotification);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [linkedFileId, setLinkedFileId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Mock tasks for this project (in a real app, these would come from a useProjectTasks hook)
  const [projectTasks, setProjectTasks] = useState([
    { id: '1', title: 'Site conditions analysis', status: 'done', priority: 'high', assignee: 'Ana Kim' },
    { id: '2', title: 'Draft schematic floor plans', status: 'in_progress', priority: 'critical', assignee: 'Ana Kim' },
    { id: '3', title: 'Review structural grid', status: 'todo', priority: 'medium', assignee: 'John Smith' },
  ]);

  const handleAddTask = () => {
    if (!title.trim()) return;

    const assignee = members?.find(m => m.user_id === assigneeId);
    
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      status: 'todo' as TaskStatus,
      priority,
      assignee: assignee?.profile?.full_name || 'Unassigned',
    };

    setProjectTasks([newTask, ...projectTasks]);
    
    // Add notification if assigned to someone else
    if (assigneeId) {
      addNotification({
        type: 'task',
        author: 'System',
        title: 'New Project Task Assigned',
        subtitle: `${projectName}: ${title}`,
        projectId: projectId
      });
    }

    setTitle('');
    setDescription('');
    setAssigneeId('');
    setLinkedFileId('');
    setIsAdding(false);
  };

  const toggleTaskStatus = (id: string) => {
    setProjectTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' as TaskStatus } 
        : task
    ));
  };

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange}
      title={`Tasks: ${projectName}`}
      description="Manage assignments and track progress for this project."
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-4">
        {/* Quick Add Interface */}
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full h-12 border-2 border-dashed border-[var(--border-subtle)] rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-[var(--text-tertiary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all bg-[var(--bg-raised)]/30"
          >
            <Plus className="w-4 h-4" /> Add New Task for Project
          </button>
        ) : (
          <div className="bg-[var(--bg-raised)] p-5 rounded-2xl border border-[var(--border-subtle)] space-y-4 animate-in fade-in slide-in-from-top-2 relative">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">New Task Details</span>
              <button 
                onClick={() => setIsAdding(false)} 
                className="text-[var(--text-tertiary)] hover:text-rose-500 transition-colors p-1 -mr-1 -mt-1"
                aria-label="Close form"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <Input 
              placeholder="What needs to be done?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 border-[var(--border-default)] rounded-xl bg-white shadow-sm"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-[var(--text-tertiary)] pl-1">Assign To</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger className="h-10 bg-white rounded-xl">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members?.map(m => (
                      <SelectItem key={m.id} value={m.user_id}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-[8px] font-black text-[var(--accent)]">
                            {m.profile?.full_name?.[0] || '?'}
                          </div>
                          {m.profile?.full_name || 'Unknown'}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-[var(--text-tertiary)] pl-1">Priority</Label>
                <Select value={priority} onValueChange={(v: string) => setPriority(v as TaskPriority)}>
                  <SelectTrigger className="h-10 bg-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['low', 'medium', 'high', 'critical'].map(p => (
                      <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-[var(--text-tertiary)] pl-1">Linked File</Label>
              <Select value={linkedFileId} onValueChange={setLinkedFileId}>
                <SelectTrigger className="h-10 bg-white rounded-xl">
                  <SelectValue placeholder="Attach project file (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {files?.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate max-w-[200px]">{f.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsAdding(false)} className="rounded-xl px-6 h-10">Cancel</Button>
              <Button onClick={handleAddTask} className="rounded-xl px-8 h-10 bg-[var(--text-primary)] text-white">Create Task</Button>
            </div>
          </div>
        )}

        {/* Existing Tasks List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          <div className="flex items-center justify-between px-1 mb-2">
            <h4 className="font-mono text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Active Tasks ({projectTasks.length})</h4>
          </div>
          
          {projectTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white border border-[var(--border-subtle)] p-4 rounded-2xl hover:shadow-md transition-all group flex items-start justify-between"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all active:scale-90",
                    task.status === 'done' 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : "border-[var(--border-default)] hover:border-emerald-500 hover:bg-emerald-50/50"
                  )}
                >
                  {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <div>
                  <h5 className={cn(
                    "text-[14px] font-bold text-[var(--text-primary)]",
                    task.status === 'done' && "line-through opacity-50"
                  )}>{task.title}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-tertiary)]">
                      <UserIcon className="w-3 h-3" />
                      {task.assignee}
                    </div>
                    <div className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                      priorityColors[task.priority as TaskPriority]
                    )}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {projectTasks.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">
              <p className="text-[var(--text-tertiary)] font-serif italic italic text-[15px]">No tasks found for this project.</p>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="flex justify-center pt-2">
          <Button variant="link" className="text-[var(--accent)] text-[12px] font-bold">
            View all tasks in global board →
          </Button>
        </div>
      </div>
    </Modal>
  );
}
