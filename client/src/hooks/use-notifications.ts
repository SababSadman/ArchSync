import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'mention' | 'task' | 'file_upload' | 'approval' | 'team';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  time: string;
  isUnread: boolean;
  author: string;
  meta?: string;
  projectId?: string;
  isPinned?: boolean;
}

export interface NotificationPreferences {
  inApp: {
    mentions: boolean;
    taskAssigned: boolean;
    taskOverdue: boolean;
    fileUploaded: boolean;
    clientApproval: boolean;
    projectNotices: boolean;
  };
  email: {
    immediateAlerts: boolean;
    weeklyDigest: boolean;
    teamActivity: boolean;
  };
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: '1', type: 'mention', author: 'Julian Solo', title: 'Julian Solo mentioned you in a comment', subtitle: '"Need the revised lobby sections for this afternoon\'s consultant sync."', time: '10m ago', isUnread: true, meta: 'Riverside Tower · Drawing S01', projectId: 'p1', isPinned: false },
  { id: '2', type: 'approval', author: 'Project Lead', title: 'Project Lead approved the Schematic Phase', subtitle: 'Riverside Tower is moving to Design Development.', time: '2h ago', isUnread: true, meta: 'Phase Change', projectId: 'p1', isPinned: false },
  { id: '3', type: 'file_upload', author: 'Ana Kim', title: 'Ana Kim uploaded 12 new assets', subtitle: 'Site photos and drone scans from Mar 16 site visit.', time: 'Yesterday', isUnread: false, meta: 'Folder: Field Reports', projectId: 'p2', isPinned: false },
  { id: '4', type: 'task', author: 'System', title: 'Task overdue: Door Schedule Signatures', subtitle: 'Please finalize the hardware set selections.', time: 'Yesterday', isUnread: false, meta: 'Critical Priority', projectId: 'p1', isPinned: false },
];

const DEFAULT_PREFS: NotificationPreferences = {
  inApp: { mentions: true, taskAssigned: true, taskOverdue: false, fileUploaded: false, clientApproval: true, projectNotices: true },
  email: { immediateAlerts: true, weeklyDigest: false, teamActivity: true }
};

interface NotificationStore {
  notifications: AppNotification[];
  preferences: NotificationPreferences;
  markAllRead: () => void;
  markRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  togglePin: (id: string) => void;
  toggleInAppPref: (key: keyof NotificationPreferences['inApp']) => void;
  toggleEmailPref: (key: keyof NotificationPreferences['email']) => void;
}

export const useNotifications = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: INITIAL_NOTIFICATIONS,
      preferences: DEFAULT_PREFS,
      markAllRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isUnread: false }))
      })),
      markRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isUnread: false } : n)
      })),
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      togglePin: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n)
      })),
      toggleInAppPref: (key) => set((state) => ({
        preferences: {
          ...state.preferences,
          inApp: { ...state.preferences.inApp, [key]: !state.preferences.inApp[key] }
        }
      })),
      toggleEmailPref: (key) => set((state) => ({
        preferences: {
          ...state.preferences,
          email: { ...state.preferences.email, [key]: !state.preferences.email[key] }
        }
      }))
    }),
    {
      name: 'archsync-notifications-store',
    }
  )
);
