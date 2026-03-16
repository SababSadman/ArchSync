import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { X, UserPlus, Shield, ShieldCheck, ShieldAlert, Trash2, Mail, Users } from 'lucide-react';
import { useProjectMembers, useAddProjectMember, useRemoveProjectMember, ProjectMember } from '../../hooks/use-members';
import { cn } from '../../lib/utils';

interface TeamDialogProps {
  projectId: string;
  projectName: string;
  createdBy: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamDialog({ projectId, projectName, createdBy, open, onOpenChange }: TeamDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ProjectMember['role']>('viewer');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
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

  const isAdmin = currentUserId === createdBy || members?.find(m => m.user_id === currentUserId)?.role === 'lead' || members?.find(m => m.user_id === currentUserId)?.role === 'architect';

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isAdmin) return;

    try {
      await addMemberMutation.mutateAsync({ projectId, email, role });
      alert(`Successfully added ${email} to the team`);
      setEmail('');
    } catch (error: any) {
      alert(error.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!isAdmin) return;
    if (userId === createdBy) {
      alert('The project creator cannot be removed from the project.');
      return;
    }

    if (confirm(`Are you sure you want to remove ${name} from the project?`)) {
      try {
        await removeMemberMutation.mutateAsync({ projectId, userId });
        alert(`Removed ${name} from the team`);
      } catch (error: any) {
        alert(error.message || 'Failed to remove member');
      }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[var(--bg-surface)] border-[var(--border-subtle)] p-0 overflow-hidden shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent)] to-indigo-600" />
        
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              Team Management
              {isAdmin && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] px-1.5 py-0">Admin Access</Badge>}
            </DialogTitle>
            <DialogDescription className="text-[var(--text-tertiary)] font-medium">
              Manage collaborators for <span className="text-[var(--text-primary)] font-bold">{projectName}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Add Member Form - ONLY FOR ADMINS */}
          {isAdmin && (
            <form onSubmit={handleAddMember} className="space-y-3 bg-[var(--bg-raised)]/50 p-4 rounded-2xl border border-[var(--border-subtle)]">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-1.5">
                Add New Member
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <Input
                    placeholder="Collaborator's email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-[var(--bg-surface)] border-[var(--border-default)] h-10 focus-visible:ring-[var(--accent)]"
                  />
                </div>
                <Select value={role} onValueChange={(v) => setRole(v as ProjectMember['role'])}>
                  <SelectTrigger className="w-[110px] bg-[var(--bg-surface)] border-[var(--border-default)] h-10">
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
                  size="icon"
                  disabled={addMemberMutation.isPending || !email}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] h-10 w-10 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Members List */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
              Current Members ({members?.length || 0})
            </label>
            
            <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {isLoading ? (
                <div className="py-8 text-center text-sm text-[var(--text-tertiary)] animate-pulse font-medium">
                  Loading team members...
                </div>
              ) : members?.length === 0 ? (
                <div className="py-8 text-center text-sm text-[var(--text-tertiary)] border-2 border-dashed border-[var(--border-subtle)] rounded-xl font-medium">
                  No members assigned yet.
                </div>
              ) : (
                members?.map((member) => (
                  <div 
                    key={member.user_id} 
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-raised)] transition-colors group",
                      member.user_id === createdBy && "bg-slate-50 dark:bg-slate-800/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-[var(--border-subtle)] shadow-sm">
                        <AvatarImage src={member.profile?.avatar_url} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs uppercase">
                          {(member.profile?.full_name || 'U').split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--text-primary)] leading-none mb-1 flex items-center gap-1.5">
                          {member.profile?.full_name || 'Anonymous User'}
                          {member.user_id === createdBy && <span className="text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase tracking-tighter">Creator</span>}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)] leading-none">
                          {member.profile?.email}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                        {getRoleIcon(member.role)}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          {member.role}
                        </span>
                      </div>
                      {isAdmin && member.user_id !== createdBy && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.user_id, member.profile?.full_name || 'Member')}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-[var(--bg-raised)]/50 border-t border-[var(--border-subtle)]">
          <Button 
            variant="outline" 
            className="w-full border-[var(--border-default)] font-bold text-xs uppercase tracking-widest h-10"
            onClick={() => onOpenChange(false)}
          >
            Close Management
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
