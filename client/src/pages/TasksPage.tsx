import { useState } from 'react';
import { 
  LayoutDashboard, 
  List as ListIcon, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  MoreVertical,
  Paperclip,
  Filter
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/use-projects';
import { useAuth } from '../hooks/use-auth';
import { useProjectMembers } from '../hooks/use-members';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../lib/utils';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

// Types for tasks
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
  dueDate: string;
  assignee: { name: string; initials: string };
  isOverdue?: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Revise lobby section details', projectId: 'p1', status: 'todo', priority: 'high', dueDate: 'Mar 18', projectName: 'Riverside Tower', fileName: 'S01_Sections.dwg', assignee: { name: 'Julian S', initials: 'JS' } },
  { id: '2', title: 'Update door schedule signatures', projectId: 'p1', status: 'in_progress', priority: 'critical', dueDate: 'Mar 12', projectName: 'Riverside Tower', isOverdue: true, assignee: { name: 'Ana Kim', initials: 'AK' } },
  { id: '3', title: 'Prepare client presentation set', projectId: 'p2', status: 'review', priority: 'medium', dueDate: 'Mar 19', projectName: 'Mountain Villa', assignee: { name: 'Julian S', initials: 'JS' } },
  { id: '4', title: 'Export IFC for structural sync', projectId: 'p1', status: 'todo', priority: 'medium', dueDate: 'Mar 20', projectName: 'Riverside Tower', fileName: 'Master_Model.ifc', assignee: { name: 'Ana Kim', initials: 'AK' } },
];

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Done' }
];

const priorityColors: Record<TaskPriority, string> = {
  critical: 'bg-[#DC2626]',
  high: 'bg-[#D97706]',
  medium: 'bg-[#FBBF24]',
  low: 'bg-[#94A3B8]'
};

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project') || 'all';

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TaskStatus>('todo');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const { data: projects } = useProjects();
  
  const { user } = useAuth();
  const { data: members } = useProjectMembers(selectedProjectId !== 'all' ? selectedProjectId : '');
  const currentUserRole = members?.find(m => m.user_id === user?.id)?.role;
  const isReadOnly = selectedProjectId !== 'all' && (currentUserRole === 'viewer' || currentUserRole === 'client');

  const handleProjectFilterChange = (val: string) => {
    setSelectedProjectId(val);
    if (val === 'all') {
      searchParams.delete('project');
    } else {
      searchParams.set('project', val);
    }
    setSearchParams(searchParams);
  };

  const filteredTasks = selectedProjectId === 'all' 
    ? tasks 
    : tasks.filter(t => t.projectId === selectedProjectId);

  const handleAddTask = (status: TaskStatus = 'todo') => {
    setTargetStatus(status);
    setIsModalOpen(true);
  };

  const handleCreateTask = (newTask: { title: string; priority: TaskPriority; projectId: string }) => {
    const defaultProject = projects?.find(p => p.id === newTask.projectId);
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      projectId: newTask.projectId,
      projectName: defaultProject ? defaultProject.name : 'Unknown Project',
      status: targetStatus,
      priority: newTask.priority,
      dueDate: 'Mar 25', // Default due date
      assignee: { name: 'Ana Kim', initials: 'AK' } // Default assignee
    };
    setTasks(prev => [...prev, task]);
    setIsModalOpen(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (isReadOnly) return;
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Is over a column?
    const isOverAColumn = COLUMNS.some(col => col.id === overId);
    
    if (isOverAColumn) {
      if (activeTask.status !== overId) {
        setTasks(prev => {
          const activeIdx = prev.findIndex(t => t.id === activeId);
          const newTasks = [...prev];
          newTasks[activeIdx] = { ...newTasks[activeIdx], status: overId as TaskStatus };
          return newTasks;
        });
      }
      return;
    }

    // Is over another task?
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      setTasks(prev => {
        const activeIdx = prev.findIndex(t => t.id === activeId);
        const overIdx = prev.findIndex(t => t.id === overId);
        const newTasks = [...prev];
        newTasks[activeIdx] = { ...newTasks[activeIdx], status: overTask.status };
        return arrayMove(newTasks, activeIdx, overIdx);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const activeIdx = tasks.findIndex(t => t.id === activeId);
      const isOverAColumn = COLUMNS.some(col => col.id === overId);

      if (isOverAColumn) {
        setTasks(prev => {
          const newTasks = [...prev];
          newTasks[activeIdx] = { ...newTasks[activeIdx], status: overId as TaskStatus };
          return newTasks;
        });
      } else {
        const overIdx = tasks.findIndex(t => t.id === overId);
        setTasks(prev => arrayMove(prev, activeIdx, overIdx));
      }
    }
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-serif text-[clamp(24px,2.5vw,32px)] text-[var(--text-primary)] italic">
            My Tasks
          </h1>
          <p className="text-[var(--text-secondary)] font-medium mt-1">
            Track design deliverables and coordination steps.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-1 bg-[var(--bg-raised)] rounded-full flex">
            <button 
              onClick={() => setView('kanban')}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full transition-all",
                view === 'kanban' ? "bg-white shadow-sm text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full transition-all",
                view === 'list' ? "bg-white shadow-sm text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-[200px] z-20">
            <Select value={selectedProjectId} onValueChange={handleProjectFilterChange}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <SelectValue placeholder="All Projects" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects?.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isReadOnly && (
            <button 
              onClick={() => handleAddTask()}
              className="h-10 px-6 bg-[var(--text-primary)] text-white text-[13px] font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          )}
        </div>
      </div>

      {/* Kanban Content */}
      <div className="flex-1 min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full min-h-[400px]">
            {COLUMNS.map((col) => (
              <DroppableColumn 
                key={col.id} 
                column={col} 
                tasks={filteredTasks} 
                onAddTask={handleAddTask}
                isReadOnly={isReadOnly}
              >
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar min-h-[150px]">
                  <SortableContext
                    id={col.id}
                    items={filteredTasks.filter(t => t.status === col.id).map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredTasks.filter(t => t.status === col.id).map((task) => (
                      <SortableTask key={task.id} task={task} />
                    ))}
                  </SortableContext>
                </div>
              </DroppableColumn>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <NewTaskModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onCreate={handleCreateTask}
        status={targetStatus}
        projects={projects || []}
        defaultProjectId={selectedProjectId === 'all' ? (projects?.[0]?.id || '') : selectedProjectId}
      />
    </div>  );
}

function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  return (
    <div className={cn(
      "group bg-white border border-[var(--border-default)] rounded-[20px] p-5 shadow-sm hover:border-[var(--accent)] transition-all cursor-grab active:grabbing relative overflow-hidden",
      isDragging && "scale-[1.02] shadow-2xl border-[var(--accent)] rotate-[1deg]",
      task.status === 'in_progress' && "border-r-2 border-r-[var(--accent)]",
      task.status === 'done' && "opacity-60"
    )}>
      {/* Subtle Background Icon */}
      <div className="absolute -right-2 -bottom-2 w-12 h-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500">
         <CheckCircle2 className="w-full h-full" />
      </div>

      {task.fileName && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded bg-[var(--accent-subtle)] flex items-center justify-center">
            <Paperclip className="w-2.5 h-2.5 text-[var(--accent)]" />
          </div>
          <span className="font-mono text-[8px] font-black text-[var(--accent)] tracking-widest truncate uppercase opacity-80 decoration-[var(--accent)]/20 underline-offset-4">
            {task.fileName}
          </span>
        </div>
      )}
      {task.projectName && (
        <div className="flex items-center gap-1.5 mb-2 font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] bg-[var(--bg-raised)] w-fit px-2 py-0.5 rounded border border-[var(--border-subtle)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-sm shadow-[var(--accent)]/30" />
          {task.projectName}
        </div>
      )}
      <h4 className="font-serif text-[15px] italic text-[var(--text-primary)] group-hover:text-[var(--accent)] leading-tight mb-5 transition-colors">
        {task.title}
      </h4>
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className={cn("w-[7px] h-[7px] rounded-full shadow-sm", priorityColors[task.priority])} />
          <div className={cn(
            "flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest",
            task.isOverdue ? "text-[var(--red)]" : "text-[var(--text-tertiary)]"
          )}>
            <Clock className="w-2.5 h-2.5 opacity-60" />
            {task.dueDate}
          </div>
        </div>
        <div 
          className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--bg-raised)] to-white border border-[var(--border-subtle)] flex items-center justify-center text-[8px] font-black text-[var(--text-tertiary)] shadow-sm group-hover:scale-110 transition-transform"
          title={task.assignee.name}
        >
          {task.assignee.initials}
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ 
  column, 
  tasks, 
  onAddTask,
  isReadOnly,
  children 
}: { 
  column: { id: TaskStatus; label: string }; 
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  isReadOnly?: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-full bg-[var(--bg-raised)]/50 rounded-2xl p-3 border transition-all",
        isOver ? "border-[var(--accent)] bg-[var(--accent-subtle)]/30" : "border-[var(--border-subtle)]"
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 mb-4 shrink-0 border-b border-[var(--border-subtle)] pb-4">
        <h3 className="font-mono text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
          {column.label}
        </h3>
        <span className="font-serif text-[14px] italic text-[var(--accent)] font-bold">
          {tasks.filter(t => t.status === column.id).length}
        </span>
      </div>

      {children}

      {!isReadOnly && (
        <button 
          onClick={() => onAddTask(column.id)}
          className="mt-3 w-full h-10 border border-dashed border-[var(--border-default)] rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold text-[var(--text-tertiary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all shrink-0"
        >
          <Plus className="w-3 h-3" /> Add Task
        </button>
      )}
    </div>
  );
}

function NewTaskModal({ 
  open, 
  onOpenChange, 
  onCreate,
  status,
  projects,
  defaultProjectId
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onCreate: (task: { title: string; priority: TaskPriority; projectId: string }) => void;
  status: TaskStatus;
  projects: any[];
  defaultProjectId: string;
}) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState<string>(defaultProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title, priority, projectId });
    setTitle('');
    setPriority('medium');
  };

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange}
      title="Create New Task"
      description={`Adding task to ${status.replace('_', ' ')}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-2">
        <div className="space-y-2">
          <Label>Task Title</Label>
          <Input 
            placeholder="What needs to be done?" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-12 border-[var(--border-default)] rounded-xl"
          />
        </div>

        <div className="space-y-2 relative z-[100]">
          <Label>Assign to Project</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <div className="grid grid-cols-4 gap-2">
            {(['low', 'medium', 'high', 'critical'] as TaskPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all",
                  priority === p 
                    ? "bg-[var(--text-primary)] text-white border-[var(--text-primary)]" 
                    : "border-[var(--border-default)] text-[var(--text-tertiary)] hover:border-[var(--accent)]"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="flex-1 h-11 bg-[var(--text-primary)] text-white rounded-xl"
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
