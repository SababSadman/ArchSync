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
import { TaskDetailsSidebar } from '../components/features/tasks/TaskDetailsSidebar';
import { TaskTemplatesModal } from '../components/features/tasks/TaskTemplatesModal';
import { WorkloadView } from '../components/features/tasks/WorkloadView';
import { useNotifications } from '../hooks/use-notifications';
import { 
  BarChart3, 
  Layers, 
  User as UserIcon, 
  MapPin, 
  Flag, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';

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
  phase: string;
  dueDate: string;
  assignee: { name: string; initials: string; avatarUrl?: string };
  isOverdue?: boolean;
  isRecurring?: boolean;
  description?: string;
  comments?: Array<{
    id: string;
    author: { name: string; initials: string; avatarUrl?: string };
    content: string;
    timestamp: string;
  }>;
}

const INITIAL_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'Revise lobby section details', 
    projectId: 'p1', 
    status: 'todo', 
    priority: 'high', 
    phase: 'Design Dev',
    dueDate: 'Mar 18, 2026', 
    projectName: 'Riverside Tower', 
    fileName: 'S01_Sections.dwg', 
    assignee: { name: 'Julian S', initials: 'JS' },
    description: 'The lobby section needs to be updated with the new structural grid dimensions provided by the engineers.',
    isRecurring: false,
    comments: [
      { id: 'c1', author: { name: 'Ana Kim', initials: 'AK' }, content: 'This is high priority - client presentation is Mar 30.', timestamp: 'Mar 15' }
    ]
  },
  { 
    id: '2', 
    title: 'Update door schedule signatures', 
    projectId: 'p1', 
    status: 'in_progress', 
    priority: 'critical', 
    phase: 'Construction',
    dueDate: 'Mar 12, 2026', 
    projectName: 'Riverside Tower', 
    isOverdue: true, 
    assignee: { name: 'Ana Kim', initials: 'AK' },
    description: 'All door schedules must be signed off by the lead architect before submitting to the contractor.',
    isRecurring: true
  },
  { 
    id: '3', 
    title: 'Prepare client presentation set', 
    projectId: 'p2', 
    status: 'review', 
    priority: 'medium', 
    phase: 'Schematic Design',
    dueDate: 'Mar 19, 2026', 
    projectName: 'Mountain Villa', 
    assignee: { name: 'Julian S', initials: 'JS' } 
  },
  { 
    id: '4', 
    title: 'Export IFC for structural sync', 
    projectId: 'p1', 
    status: 'todo', 
    priority: 'medium', 
    phase: 'Design Dev',
    dueDate: 'Mar 20, 2026', 
    projectName: 'Riverside Tower', 
    fileName: 'Master_Model.ifc', 
    assignee: { name: 'Ana Kim', initials: 'AK' } 
  },
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

const TEMPLATE_TASKS: Record<string, Partial<Task>[]> = {
  'schematic': [
    { title: 'Project Kickoff Meeting', phase: 'Schematic Design', priority: 'high', status: 'done' },
    { title: 'Site Analysis & Survey Review', phase: 'Schematic Design', priority: 'medium', status: 'done' },
    { title: 'Conceptual Design Sketches', phase: 'Schematic Design', priority: 'high', status: 'in_progress' },
    { title: 'Budget Allocation Study', phase: 'Schematic Design', priority: 'medium', status: 'todo' },
    { title: 'Client Sign-off on Concept', phase: 'Schematic Design', priority: 'critical', status: 'todo' },
  ],
  'design-dev': [
    { title: 'Mechanical/Electrical Coordination', phase: 'Design Dev', priority: 'high', status: 'todo' },
    { title: 'Material Selection & Specifications', phase: 'Design Dev', priority: 'medium', status: 'todo' },
    { title: 'Life Safety Review', phase: 'Design Dev', priority: 'critical', status: 'todo' },
    { title: 'Elevations & Sections Drafting', phase: 'Design Dev', priority: 'high', status: 'todo' },
  ],
  'construction': [
    { title: 'Permit Application Prep', phase: 'Construction', priority: 'critical', status: 'todo' },
    { title: 'Detail Drawings Set', phase: 'Construction', priority: 'high', status: 'todo' },
    { title: 'Structural Engineer Sign-off', phase: 'Construction', priority: 'critical', status: 'todo' },
  ],
  'closeout': [
    { title: 'As-Built Drawings Finalization', phase: 'Closeout', priority: 'medium', status: 'todo' },
    { title: 'Punch List Inspection', phase: 'Closeout', priority: 'high', status: 'todo' },
    { title: 'Warranty Documentation', phase: 'Closeout', priority: 'low', status: 'todo' },
  ]
};

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project') || 'all';

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [view, setView] = useState<'kanban' | 'list' | 'workload'>('kanban');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TaskStatus>('todo');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const { data: projects } = useProjects();
  
  const { user } = useAuth();
  const { data: members } = useProjectMembers(selectedProjectId !== 'all' ? selectedProjectId : '');
  const addNotification = useNotifications(state => state.addNotification);
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

  const filteredTasks = tasks.filter(t => {
    const projectMatch = selectedProjectId === 'all' || t.projectId === selectedProjectId;
    if (!projectMatch) return false;

    if (activeFilter === 'overdue') return t.isOverdue;
    if (activeFilter === 'my_tasks') return t.assignee.name === 'Ana Kim'; // Mock current user
    if (activeFilter === 'high_priority') return t.priority === 'high' || t.priority === 'critical';
    if (activeFilter === 'in_review') return t.status === 'review';
    
    // Phase filters (logic for specific phase chips)
    if (activeFilter === 'phase_schematic') return t.phase === 'Schematic Design';
    if (activeFilter === 'phase_dd') return t.phase === 'Design Dev' || t.phase === 'Design Development';
    
    return true;
  });

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
      phase: 'Design Dev', // Default phase
      dueDate: 'Mar 25, 2026', // Default due date
      assignee: { name: 'Ana Kim', initials: 'AK' } // Default assignee
    };
    setTasks(prev => [...prev, task]);
    
    // Notification for task creation (mocking assignment notice)
    addNotification({
      type: 'task',
      author: 'System',
      title: 'Global Task Created',
      subtitle: `New task "${newTask.title}" added to project.`,
      projectId: newTask.projectId
    });

    setIsModalOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const templateData = TEMPLATE_TASKS[templateId];
    if (!templateData) return;

    const projectId = selectedProjectId === 'all' ? (projects?.[0]?.id || '1') : selectedProjectId;
    
    const newTasks: Task[] = templateData.map((t, index) => ({
      id: `template-${templateId}-${Date.now()}-${index}`,
      title: t.title || 'Untitled Task',
      status: (t.status as TaskStatus) || 'todo',
      priority: (t.priority as TaskPriority) || 'medium',
      projectId: projectId,
      projectName: projects?.find(p => p.id === projectId)?.name || 'Project',
      phase: t.phase || 'General',
      assignee: { name: 'Ana Kim', initials: 'AK' }, // Default to current user
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week out
      isOverdue: false,
      isRecurring: false,
      description: `Task added from ${templateId} template.`,
      comments: []
    }));

    setTasks(prev => [...prev, ...newTasks]);
    setIsTemplatesModalOpen(false);
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
                view === 'kanban' ? "bg-[var(--bg-surface)] shadow-sm text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full transition-all",
                view === 'list' ? "bg-[var(--bg-surface)] shadow-sm text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
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

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar shrink-0">
        <span className="text-[12px] font-medium text-[var(--text-tertiary)] mr-2 shrink-0">Filter:</span>
        {[
          { id: 'all', label: 'All' },
          { id: 'overdue', label: 'Overdue', icon: AlertCircle, color: 'text-rose-500' },
          { id: 'my_tasks', label: 'My tasks' },
          { id: 'high_priority', label: 'High priority' },
          { id: 'in_review', label: 'In Review' },
          { id: 'phase_schematic', label: 'Phase: Schematic' },
          { id: 'phase_dd', label: 'Phase: Design Dev' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-4 py-1.5 rounded-lg border text-[13px] font-medium transition-all flex items-center gap-2 shrink-0 h-9",
              activeFilter === filter.id 
                ? "bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)] shadow-sm" 
                : "bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
            )}
          >
            {filter.icon && <filter.icon className={cn("w-3.5 h-3.5", filter.color)} />}
            {filter.label}
          </button>
        ))}
      </div>

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-[var(--border-subtle)]">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setView('kanban')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[13px] font-bold",
              view === 'kanban' ? "bg-white shadow-sm text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Kanban
          </button>
          <button 
            onClick={() => setView('list')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[13px] font-bold",
              view === 'list' ? "bg-white shadow-sm text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            )}
          >
            <ListIcon className="w-4 h-4" />
            List
          </button>
          <button 
            onClick={() => setView('workload')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[13px] font-bold",
              view === 'workload' ? "bg-white shadow-sm text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Workload
          </button>
        </div>

        <button 
          onClick={() => setIsTemplatesModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-subtle)] text-[13px] font-bold text-[var(--text-primary)] hover:border-[var(--accent)] transition-all shadow-sm group"
        >
          <div className="w-6 h-6 rounded flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:scale-110 transition-transform">
            <span role="img" aria-label="template" className="text-[12px]">📋</span>
          </div>
          Templates
        </button>
      </div>

      {/* Kanban Content */}
      {view === 'kanban' && (
        <div className="flex-1 min-h-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col md:flex-row gap-6 h-full min-h-[400px] md:overflow-x-auto pb-4 custom-scrollbar">
              {COLUMNS.map((col) => (
                <div key={col.id} className="flex-1 min-w-full md:min-w-[300px] flex flex-col h-auto md:h-full">
                  <DroppableColumn 
                    column={col} 
                    tasks={filteredTasks} 
                    onAddTask={handleAddTask}
                    isReadOnly={isReadOnly}
                  >
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar min-h-[200px] max-h-[500px] md:max-h-none">
                      <SortableContext
                        id={col.id}
                        items={filteredTasks.filter(t => t.status === col.id).map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {filteredTasks.filter(t => t.status === col.id).map((task) => (
                          <SortableTask 
                            key={task.id} 
                            task={task} 
                            onClick={() => handleTaskClick(task)} 
                            onUpdateTask={handleUpdateTask}
                          />
                        ))}
                      </SortableContext>
                    </div>
                  </DroppableColumn>
                </div>
              ))}
            </div>

            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Workload View */}
      {view === 'workload' && (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <WorkloadView 
            tasks={tasks} 
            members={members || []} 
            projectName={projects?.find(p => p.id === selectedProjectId)?.name || 'All Projects'} 
          />
        </div>
      )}

      {/* List View placeholder */}
      {view === 'list' && (
        <div className="flex-1 min-h-0 py-12 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl bg-white/50 backdrop-blur-sm">
           <ListIcon className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4 opacity-20" />
           <p className="text-[var(--text-tertiary)] font-serif italic text-lg">List view is coming soon...</p>
        </div>
      )}

      <NewTaskModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onCreate={handleCreateTask}
        status={targetStatus}
        projects={projects || []}
        defaultProjectId={selectedProjectId === 'all' ? (projects?.[0]?.id || '') : selectedProjectId}
      />

      <TaskDetailsSidebar 
        task={selectedTask}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onUpdateTask={handleUpdateTask}
        members={members || []}
      />

      <TaskTemplatesModal 
        open={isTemplatesModalOpen}
        onOpenChange={setIsTemplatesModalOpen}
        onSelectTemplate={handleApplyTemplate}
      />
    </div>  );
}

function SortableTask({ task, onClick, onUpdateTask }: { task: Task; onClick: () => void; onUpdateTask: (task: Task) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const addNotification = useNotifications(state => state.addNotification);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    onUpdateTask({ ...task, status: newStatus as TaskStatus });
    
    if (newStatus === 'done') {
      addNotification({
        type: 'task',
        author: 'System',
        title: 'Task Completed',
        subtitle: `"${task.title}" has been marked as complete.`,
        projectId: task.projectId
      });
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      <TaskCard task={task} onToggleStatus={handleToggleStatus} />
    </div>
  );
}

function TaskCard({ task, isDragging, onToggleStatus }: { task: Task; isDragging?: boolean; onToggleStatus?: (e: React.MouseEvent) => void }) {
  return (
    <div className={cn(
      "group bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[20px] p-5 shadow-sm hover:border-[var(--accent)] transition-all cursor-grab active:grabbing relative overflow-hidden",
      isDragging && "scale-[1.02] shadow-2xl border-[var(--accent)] rotate-[1deg]",
      task.status === 'done' && "bg-[var(--bg-raised)]/30 border-[var(--border-subtle)]"
    )}>
      {/* Interaction Layer: Status Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={onToggleStatus}
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all active:scale-90",
            task.status === 'done' 
              ? "bg-[var(--green)] border-[var(--green)] text-white" 
              : "border-[var(--border-default)] hover:border-[var(--green)] hover:bg-[var(--green-bg)]/50 bg-[var(--bg-surface)]"
          )}
        >
          {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Subtle Background Icon */}
      <div className="absolute -right-2 -bottom-2 w-12 h-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none">
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
      <h4 className={cn(
        "font-serif text-[15px] italic text-[var(--text-primary)] group-hover:text-[var(--accent)] leading-tight mb-5 transition-all pr-8",
        task.status === 'done' && "line-through opacity-40"
      )}>
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
