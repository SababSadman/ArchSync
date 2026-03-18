import { useState } from 'react';
import { 
  Bell, 
  AtSign, 
  CheckSquare, FileUp, FileCheck,
  MoreHorizontal, Settings as SettingsIcon, Check, Filter, Trash2,
  Pin,
  PinOff
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useProjects } from '../hooks/use-projects';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';

import { useNotifications, NotificationType, AppNotification } from '../hooks/use-notifications';
import { toast } from 'sonner';

const typeStyles: Record<NotificationType, { icon: any; color: string; label: string; emoji: string }> = {
  mention: { icon: AtSign, color: 'bg-orange-50 text-orange-600', label: 'Mention', emoji: '📍' },
  approval: { icon: FileCheck, color: 'bg-emerald-50 text-emerald-600', label: 'Approval', emoji: '✅' },
  file_upload: { icon: FileUp, color: 'bg-blue-50 text-blue-600', label: 'Upload', emoji: '📤' },
  task: { icon: CheckSquare, color: 'bg-purple-50 text-purple-600', label: 'Task', emoji: '✅' },
  team: { icon: Bell, color: 'bg-slate-50 text-slate-600', label: 'Team', emoji: '👥' }
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [prefOpen, setPrefOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const { data: projects } = useProjects();
  
  const { notifications, preferences, markAllRead, toggleInAppPref, toggleEmailPref, togglePin } = useNotifications();
  const unreadCount = notifications.filter(n => n.isUnread).length;

  const filteredNotifications = notifications.filter(n => {
    if (selectedProjectId !== 'all' && n.projectId !== selectedProjectId && n.projectId) return false;
    if (filter === 'all') return true;
    if (filter === 'mentions') return n.type === 'mention';
    if (filter === 'tasks') return n.type === 'task';
    if (filter === 'files') return n.type === 'file_upload';
    if (filter === 'approvals') return n.type === 'approval';
    return true;
  });

  const pinnedNotifications = filteredNotifications.filter(n => n.isPinned);
  const unpinnedNotifications = filteredNotifications.filter(n => !n.isPinned);

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* Main List */}
      <div className="flex-1 space-y-8">
        <div className="flex items-end justify-between border-b border-[var(--border-subtle)] pb-6">
          <div>
            <h1 className="font-serif text-[clamp(24px,2.5vw,32px)] text-[var(--text-primary)] italic">
              Notifications
            </h1>
            <p className="text-[var(--text-tertiary)] font-mono text-[10px] uppercase tracking-widest mt-2 font-bold">
              ArchSync Alerts · {unreadCount} unread
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-[200px] z-20">
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="h-9">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <SelectValue placeholder="All Projects" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <button 
               onClick={markAllRead}
               disabled={unreadCount === 0}
               className="h-9 px-4 text-[12px] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] rounded-xl transition-all border border-[var(--border-default)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
            <button 
              onClick={() => setPrefOpen(!prefOpen)}
              className="lg:hidden h-9 w-9 flex items-center justify-center border border-[var(--border-default)] rounded-xl text-[var(--text-secondary)]"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[var(--border-subtle)] -mt-4">
          {['all', 'mentions', 'tasks', 'files', 'approvals'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "pb-3 text-[12px] font-bold capitalize transition-all border-b-2",
                filter === t ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              {t === 'all' ? 'All Alerts' : t}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="bg-white border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
          {pinnedNotifications.length > 0 && (
            <>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] bg-[var(--accent-subtle)]/30 px-6 py-3 font-black border-b border-[var(--border-subtle)] flex items-center gap-2">
                <Pin className="w-3 h-3" /> Pinned
              </div>
              <div className="divide-y divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
                {pinnedNotifications.map((n) => (
                  <NotificationRow key={n.id} notification={n} />
                ))}
              </div>
            </>
          )}

          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] bg-[var(--bg-raised)] px-6 py-3 font-bold border-b border-[var(--border-subtle)]">
            Today
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {unpinnedNotifications.filter(n => n.time.includes('m ago') || n.time.includes('h ago')).map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] bg-[var(--bg-raised)] px-6 py-3 font-bold border-y border-[var(--border-subtle)] mt-[-1px]">
            Yesterday
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {unpinnedNotifications.filter(n => n.time === 'Yesterday').map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>
        </div>
      </div>

      {/* Preferences Sidebar */}
      <div className={cn(
        "lg:w-[320px] lg:flex flex-col shrink-0 gap-6",
        prefOpen ? "flex" : "hidden"
      )}>
        <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm sticky top-[76px]">
          <h2 className="font-serif text-[20px] italic text-[var(--text-primary)] mb-6">Preferences</h2>
          
          <div className="space-y-8">
            <section>
              <h3 className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black mb-4 flex items-center gap-2">
                <Bell className="w-3 h-3" /> In-app Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { label: '@Mentions', on: preferences.inApp.mentions, key: 'mentions' as const },
                  { label: 'Task Assigned', on: preferences.inApp.taskAssigned, key: 'taskAssigned' as const },
                  { label: 'Task Overdue', on: preferences.inApp.taskOverdue, key: 'taskOverdue' as const },
                  { label: 'File Uploaded', on: preferences.inApp.fileUploaded, key: 'fileUploaded' as const },
                  { label: 'Client Approval', on: preferences.inApp.clientApproval, key: 'clientApproval' as const },
                  { label: 'Project Notices', on: preferences.inApp.projectNotices, key: 'projectNotices' as const }
                ].map((p) => (
                   <div key={p.label} className="flex items-center justify-between group">
                    <span className="text-[13px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{p.label}</span>
                    <Toggle on={p.on} onChange={() => { toggleInAppPref(p.key); toast.success('Preference saved'); }} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black mb-4 flex items-center gap-2">
                <AtSign className="w-3 h-3" /> Email Summary
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Immediate Alerts', on: preferences.email.immediateAlerts, key: 'immediateAlerts' as const },
                  { label: 'Weekly Digest', on: preferences.email.weeklyDigest, key: 'weeklyDigest' as const },
                  { label: 'Team Activity', on: preferences.email.teamActivity, key: 'teamActivity' as const }
                ].map((p) => (
                   <div key={p.label} className="flex items-center justify-between group">
                    <span className="text-[13px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{p.label}</span>
                    <Toggle on={p.on} onChange={() => { toggleEmailPref(p.key); toast.success('Preference saved'); }} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ notification: n }: { notification: AppNotification }) {
  const style = typeStyles[n.type];
  const { markRead, deleteNotification, togglePin } = useNotifications();

  return (
    <div 
      onClick={() => n.isUnread && markRead(n.id)}
      className={cn(
      "flex items-start gap-4 p-5 hover:bg-[var(--bg-raised)] transition-all cursor-pointer relative group",
      n.isUnread && "bg-[var(--accent-subtle)]/40 after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-[var(--accent)]",
      n.isPinned && "bg-[var(--bg-raised)]/20"
    )}>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/50 text-[16px] shadow-sm", style.color)}>
        {style.emoji}
      </div>
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[13px] text-[var(--text-primary)] leading-tight">
             {n.title.split(n.author).map((part, i) => (
               <span key={i}>
                 {part}
                 {i === 0 && <span className="font-black underline decoration-[var(--accent)]/30 underline-offset-3">{n.author}</span>}
               </span>
             ))}
          </p>
        </div>
        <p className="text-[12px] text-[var(--text-secondary)] line-clamp-2 font-medium leading-relaxed italic opacity-80 mb-2">
          {n.subtitle}
        </p>
        {n.meta && (
          <span className="font-mono text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight flex items-center gap-1.5 px-2 py-0.5 bg-[var(--bg-raised)] rounded border border-[var(--border-subtle)] w-fit">
             {n.meta}
          </span>
        )}
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="flex items-center gap-2">
           <span className="font-mono text-[10px] text-[var(--text-tertiary)] font-medium">
            {n.time}
          </span>
          {n.isPinned && <Pin className="w-3 h-3 text-[var(--accent)]" />}
        </div>
        
        {n.isUnread && (
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full shadow-sm shadow-blue-500/30" />
        )}
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); togglePin(n.id); toast.success(n.isPinned ? 'Unpinned' : 'Pinned'); }}
            className={cn(
              "p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)]/30 rounded-md border border-transparent hover:border-[var(--accent)]/10 transition-all",
              n.isPinned && "text-[var(--accent)]"
            )}
            title={n.isPinned ? "Unpin" : "Pin"}
          >
            {n.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); toast.success('Notification deleted'); }}
            className="p-1.5 text-[var(--text-tertiary)] hover:text-red-600 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-all"
            title="Delete Notification"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange?: () => void }) {
  return (
    <button 
      onClick={onChange}
      className={cn(
        "w-9 h-5 rounded-full relative transition-all duration-300",
        on ? "bg-[var(--accent)] shadow-inner" : "bg-[var(--border-strong)]"
      )}
    >
      <div className={cn(
        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm",
        on ? "left-5" : "left-1"
      )} />
    </button>
  );
}
