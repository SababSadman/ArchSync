import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Building, 
  Users, 
  Bell, 
  Zap,
  Camera,
  LogOut,
  Mail,
  Lock,
  Download,
  CheckCircle2,
  Code2,
  Copy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { useNotifications } from '../hooks/use-notifications';
import { toast } from 'sonner';

type Tab = 'profile' | 'studio' | 'notifications' | 'plugins';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user } = useAuth();
  
  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'studio', label: 'Studio', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'plugins', label: 'Plugins', icon: Zap },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="border-b border-[var(--border-subtle)] pb-10 mb-10">
        <h1 className="font-serif text-[clamp(24px,2.5vw,32px)] text-[var(--text-primary)] italic">
          Account & Workspace
        </h1>
        <p className="text-[var(--text-secondary)] font-medium mt-1">
          Manage your identity and studio synchronization tools.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Tab Nav */}
        <aside className="lg:w-[220px] shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-[var(--text-primary)] text-white shadow-lg shadow-black/10" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]"
                )}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="hidden lg:block h-px bg-[var(--border-subtle)] my-6" />
          
          <button 
            onClick={() => supabase.auth.signOut()}
            className="hidden lg:flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-[var(--red)] hover:bg-red-50 rounded-xl transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </aside>

        {/* Tab Content */}
        <div className="flex-1 max-w-[800px]">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'studio' && <StudioTab />}
          {activeTab === 'plugins' && <PluginsTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <section className="bg-white border border-[var(--border-subtle)] p-8 rounded-2xl shadow-sm">
        <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black block mb-6">Your Profile</label>
        
        <div className="flex items-center gap-8 mb-10">
          <div className="relative group cursor-pointer shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#1F6FEB] flex items-center justify-center text-2xl font-black text-white shadow-xl ring-4 ring-white">
               {user?.email?.[0].toUpperCase() || 'AK'}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ring-4 ring-white">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-[22px] italic text-[var(--text-primary)] leading-tight">Ana Kim</h3>
            <p className="text-[14px] text-[var(--text-secondary)] font-medium mt-1">Lead Architect · Principal at Studio Meridian</p>
            <button className="mt-4 text-[12px] font-bold text-[var(--accent)] hover:underline underline-offset-4 decoration-current/30">Change Profile Photo</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" defaultValue="Ana Kim" icon={User} />
          <Input label="Job Title" defaultValue="Lead Architect" icon={Building} />
          <Input label="Email Address" defaultValue={user?.email || ''} readOnly icon={Mail} />
          <Input label="Timezone" defaultValue="PST (UTC-8)" icon={Lock} />
        </div>
        
        <div className="mt-10 pt-8 border-t border-[var(--border-subtle)]">
          <button className="h-11 px-8 bg-[var(--text-primary)] text-white font-bold rounded-xl shadow-lg shadow-black/10 hover:opacity-90 transition-all text-[13px]">
            Save Profile Changes
          </button>
        </div>
      </section>
    </div>
  );
}

function StudioTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
       <section className="bg-white border border-[var(--border-subtle)] p-8 rounded-2xl shadow-sm">
        <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black block mb-6">Studio Branding</label>
        
        <div className="flex items-center gap-8 mb-10 border-b border-[var(--border-subtle)] pb-10">
          <div className="w-16 h-16 rounded-xl bg-[var(--text-primary)] flex items-center justify-center text-xl font-serif font-black text-white shadow-lg overflow-hidden group relative cursor-pointer">
            AS
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
             <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Studio Meridian</h3>
             <p className="text-[12px] text-[var(--text-tertiary)] font-medium mt-1 font-mono uppercase tracking-tighter">Plan: <span className="text-[var(--accent)]">Enterprise Professional</span></p>
             <button className="mt-3 h-8 px-4 bg-[var(--accent-subtle)] text-[var(--accent)] text-[11px] font-bold rounded-lg border border-[var(--accent)]/10">Manage Subscription</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           <Input label="Studio Name" defaultValue="Studio Meridian" />
           <Input label="Workspace URL" defaultValue="meridian.archsync.com" readOnly trailingIcon={Lock} />
           <Input label="Primary Address" defaultValue="140 Main St, Seattle, WA 98104" />
        </div>
       </section>
    </div>
  );
}

function PluginsTab() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Dark Hero */}
      <div className="bg-[#1A1916] rounded-2xl p-8 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
        <div className="relative z-10 space-y-4">
           <h2 className="font-serif text-[32px] text-white italic">Desktop Sync Plugins</h2>
           <p className="text-white/60 text-[15px] font-medium max-w-sm mx-auto leading-relaxed">
             Sync drawing assets directly from AutoCAD and Revit with one click.
           </p>
           <div className="flex justify-center gap-4 pt-4">
              <button className="h-10 px-6 bg-white text-[var(--text-primary)] font-bold rounded-xl flex items-center gap-2 hover:bg-[var(--bg-raised)] transition-all shadow-xl">
                 <Download className="w-4 h-4" /> AutoCAD Plugin
              </button>
              <button className="h-10 px-6 bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20">
                 <Download className="w-4 h-4" /> Revit Plugin
              </button>
           </div>
        </div>
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent)]/30 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600/20 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PluginCard 
          icon="📐"
          name="AutoCAD Connector"
          version="v2.4.1"
          description="Bridges your local .dwg drafting environment with ArchSyc Cloud sync sets."
          beta
        />
        <PluginCard 
           icon="🏗️"
           name="Revit BIM Exporter"
           version="v1.9.0"
           description="Optimized RFA and RVT export to IFC with metadata preservation."
        />
      </div>

      {/* Code Block Section */}
      <section className="bg-[#1A1916] rounded-2xl p-8 shadow-2xl border border-white/5">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Code2 className="w-4 h-4 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
               </div>
               <span className="font-mono text-[10px] uppercase tracking-widest text-white font-bold">Terminal Sync API</span>
            </div>
            <button className="text-white/40 hover:text-white transition-all">
               <Copy className="w-4 h-4" />
            </button>
         </div>
         <div className="font-mono text-[13px] leading-relaxed text-slate-300">
            <p className="text-slate-500">// Initialize local sync engine</p>
            <p className="mt-2"><span className="text-pink-400">archsync</span> auth --key <span className="text-emerald-300">"api_5126...ak_9"</span></p>
            <p className="mt-1"><span className="text-pink-400">archsync</span> sync <span className="text-slate-400">./projects/riverside</span> --watch</p>
            <p className="mt-2 text-slate-500 italic opacity-60">Scanning local assets...</p>
            <p className="text-emerald-400">✓ Connected to meridian.archsync.com</p>
         </div>
      </section>
    </div>
  );
}

function Input({ label, icon: Icon, trailingIcon: TrailingIcon, ...props }: any) {
  return (
    <div className="space-y-2 group">
      <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black px-1 group-focus-within:text-[var(--accent)] transition-colors inline-flex items-center gap-2">
        {Icon && <Icon className="w-2.5 h-2.5" />}
        {label}
      </label>
      <div className="relative">
         <input 
          {...props}
          className={cn(
            "w-full h-11 px-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none focus:border-[var(--accent)] focus:bg-white transition-all font-medium text-[13px]",
            props.readOnly && "cursor-not-allowed opacity-60",
            TrailingIcon && "pr-10"
          )}
        />
        {TrailingIcon && <TrailingIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />}
      </div>
    </div>
  );
}

function PluginCard({ icon, name, version, description, beta }: any) {
  return (
    <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-2xl shadow-sm hover:border-[var(--border-strong)] transition-all group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl drop-shadow-sm">{icon}</span>
        <div className="flex gap-2">
           <span className="font-mono text-[8px] px-2 py-0.5 bg-[var(--bg-raised)] rounded-full text-[var(--text-tertiary)] font-black uppercase tracking-widest leading-none flex items-center">{version}</span>
           {beta && <span className="font-mono text-[8px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-black uppercase tracking-widest leading-none flex items-center shadow-sm shadow-orange-500/10">BETA</span>}
        </div>
      </div>
      <h4 className="text-[14px] font-bold text-[var(--text-primary)] mb-2">{name}</h4>
      <p className="text-[12px] text-[var(--text-secondary)] font-medium leading-relaxed mb-6 opacity-80 min-h-[36px]">
        {description}
      </p>
      <ul className="space-y-2 mb-8">
         <li className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-tertiary)]">
            <CheckCircle2 className="w-3 h-3 text-[var(--green)]" /> Metadata Injection
         </li>
         <li className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-tertiary)]">
            <CheckCircle2 className="w-3 h-3 text-[var(--green)]" /> Real-time Diff Scanning
         </li>
      </ul>
      <button className="w-full h-10 bg-[var(--bg-raised)] text-[var(--text-primary)] font-bold rounded-xl text-[11px] hover:bg-[var(--text-primary)] hover:text-white transition-all shadow-sm border border-[var(--border-subtle)]">
        Download Installer (.msi)
      </button>
    </div>
  );
}

function NotificationsTab() {
  const { preferences, toggleInAppPref, toggleEmailPref } = useNotifications();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <section className="bg-white border border-[var(--border-subtle)] p-8 rounded-2xl shadow-sm">
        <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black block mb-6">Notification Preferences</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black flex items-center gap-2 mb-4">
              <Bell className="w-3.5 h-3.5" /> In-app Notifications
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
          </div>

          <div className="space-y-6">
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-black flex items-center gap-2 mb-4">
              <Mail className="w-3.5 h-3.5" /> Email Summary
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
          </div>
        </div>
      </section>
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
