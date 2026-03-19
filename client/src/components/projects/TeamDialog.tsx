import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { X, UserPlus, Shield, ShieldCheck, ShieldAlert, Trash2, Mail, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProjectMembers, useAddProjectMember, useRemoveProjectMember, ProjectMember } from '../../hooks/use-members';
import { cn } from '../../lib/utils';

interface TeamDialogProps {
  projectId: string;
  projectName: string;
  createdBy: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

export function TeamDialog({ projectId, projectName, createdBy, open, onOpenChange }: TeamDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ProjectMember['role']>('viewer');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const { data: members, isLoading } = useProjectMembers(projectId);
  const addMemberMutation = useAddProjectMember();
  const removeMemberMutation = useRemoveProjectMember();

  // Get current user to check permissions
  useState(() => {
    import('../../lib/supabase').then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) setCurrentUserId(data.user.id);
      });
    });
  });

  const isAdmin =
    currentUserId === createdBy ||
    members?.find((m) => m.user_id === currentUserId)?.role === 'lead' ||
    members?.find((m) => m.user_id === currentUserId)?.role === 'architect';

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isAdmin) return;

    try {
      await addMemberMutation.mutateAsync({ projectId, email, role });
      showFeedback('success', `${email} added to the team.`);
      setEmail('');
    } catch (error: any) {
      showFeedback('error', error.message || 'Failed to add member.');
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!isAdmin) return;
    if (userId === createdBy) {
      showFeedback('error', 'The project creator cannot be removed.');
      return;
    }
    try {
      await removeMemberMutation.mutateAsync({ projectId, userId });
      showFeedback('success', `${name} removed from the team.`);
    } catch (error: any) {
      showFeedback('error', error.message || 'Failed to remove member.');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'lead':
      case 'architect': return <ShieldAlert className="w-3.5 h-3.5 text-red-500" />;
      case 'editor': return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
      case 'client': return <Users className="w-3.5 h-3.5 text-emerald-500" />;
      case 'consultant': return <Users className="w-3.5 h-3.5 text-orange-500" />;
      default: return <Shield className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      viewer: 'Viewer', editor: 'Editor', lead: 'Lead', architect: 'Architect',
      client: 'Client', consultant: 'Consultant', admin: 'Admin', owner: 'Owner',
    };
    return labels[role] ?? role;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="sm:max-w-[500px] bg-[var(--bg-surface)] border-[var(--border-subtle)] p-0 shadow-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent)] to-indigo-600" />

        {/* Header */}
        <div className="px-6 pt-5 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              Team Management
              {isAdmin && (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] px-1.5 py-0 font-bold">
                  Admin Access
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-[var(--text-tertiary)] font-medium">
              Manage collaborators for{' '}
              <span className="text-[var(--text-primary)] font-bold">{projectName}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* ── Add Member Form (admins only) ─────────────────────── */}
          {isAdmin && (
            <form
              onSubmit={handleAddMember}
              className="space-y-2.5 bg-[var(--bg-raised)]/60 p-4 rounded-2xl border border-[var(--border-subtle)]"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                Add New Member
              </p>

              {/* Row 1 – Email bar */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Enter collaborator's email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 h-11 bg-[var(--bg-surface)] border-[var(--border-default)] focus-visible:ring-[var(--accent)] text-sm rounded-xl"
                />
              </div>

              {/* Row 2 – Role selector + Submit */}
              <div className="flex items-center gap-2">
                <Select value={role} onValueChange={(v) => setRole(v as ProjectMember['role'])}>
                  <SelectTrigger className="flex-1 bg-[var(--bg-surface)] border-[var(--border-default)] h-10 text-sm rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="lead">Project Lead</SelectItem>
                    <SelectItem value="architect">Architect</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  disabled={addMemberMutation.isPending || !email}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] h-10 px-4 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {addMemberMutation.isPending ? 'Adding…' : 'Add'}
                </Button>
              </div>

              {/* Inline feedback */}
              {feedback && (
                <div
                  className={cn(
                    'flex items-center gap-2 text-xs font-semibold rounded-xl px-3 py-2 border',
                    feedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-red-50 border-red-200 text-red-600'
                  )}
                >
                  {feedback.type === 'success'
                    ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  {feedback.message}
                </div>
              )}
            </form>
          )}

          {/* ── Members List ───────────────────────────────────────── */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
              Current Members ({members?.length ?? 0})
            </p>

            <div className="max-h-[260px] overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
              {isLoading ? (
                <div className="py-8 text-center text-sm text-[var(--text-tertiary)] animate-pulse font-medium">
                  Loading team members…
                </div>
              ) : !members?.length ? (
                <div className="py-8 text-center text-sm text-[var(--text-tertiary)] border-2 border-dashed border-[var(--border-subtle)] rounded-xl font-medium">
                  No members assigned yet.
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.user_id}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--bg-raised)] transition-colors group',
                      member.user_id === createdBy && 'bg-[var(--bg-raised)]/50'
                    )}
                  >
                    {/* Left – avatar + info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="w-9 h-9 border border-[var(--border-subtle)] shadow-sm shrink-0">
                        <AvatarImage src={member.profile?.avatar_url} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs uppercase">
                          {(member.profile?.full_name || 'U').split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-[var(--text-primary)] leading-none mb-0.5 flex items-center gap-1.5">
                          <span className="truncate">{member.profile?.full_name || 'Anonymous User'}</span>
                          {member.user_id === createdBy && (
                            <span className="text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">
                              Creator
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)] leading-none truncate">
                          {member.profile?.email ?? '—'}
                        </span>
                      </div>
                    </div>

                    {/* Right – role badge + remove */}
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        {getRoleIcon(member.role)}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          {getRoleLabel(member.role)}
                        </span>
                      </div>

                      {isAdmin && member.user_id !== createdBy && (
                        <button
                          onClick={() =>
                            handleRemoveMember(member.user_id, member.profile?.full_name ?? 'Member')
                          }
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <Button
            variant="outline"
            className="w-full border-[var(--border-default)] font-bold text-xs uppercase tracking-widest h-10 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Close Management
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
