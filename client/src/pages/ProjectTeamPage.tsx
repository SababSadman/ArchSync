import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/use-projects';
import { useProjectMembers, useAddProjectMember, useRemoveProjectMember, useUpdateProjectMemberRole, ProjectMember } from '../hooks/use-members';
import { ArrowLeft, Users, Lock, MoreHorizontal, Mail, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

export default function ProjectTeamPage() {
  const { id } = useParams();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const project = projects?.find((p) => p.id === id);
  const { data: members = [], isLoading: membersLoading } = useProjectMembers(id!);

  const [isInviting, setIsInviting] = useState(false);
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState<ProjectMember['role']>('viewer');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const addMemberMutation = useAddProjectMember();
  const removeMemberMutation = useRemoveProjectMember();
  const updateRoleMutation = useUpdateProjectMemberRole();

  useEffect(() => {
    import('../lib/supabase').then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) setCurrentUserId(data.user.id);
      });
    });
  }, []);

  const isAdmin = currentUserId === project?.created_by || 
                  members.find(m => m.user_id === currentUserId)?.role === 'lead' || 
                  members.find(m => m.user_id === currentUserId)?.role === 'architect';

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isAdmin || !id) return;
    try {
      await addMemberMutation.mutateAsync({ projectId: id, email, role: newRole });
      setEmail('');
      setIsInviting(false);
      toast.success('Member invited successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!isAdmin || !id) return;
    if (userId === project?.created_by) {
      toast.error('The project creator cannot be removed.');
      return;
    }
    if (confirm(`Remove ${name} from the project?`)) {
      try {
        await removeMemberMutation.mutateAsync({ projectId: id, userId });
        toast.success(`Removed ${name}.`);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    if (!isAdmin || !id) return;
    if (userId === project?.created_by) {
      toast.error('Cannot change the creator\'s role.');
      return;
    }
    try {
      await updateRoleMutation.mutateAsync({ projectId: id, userId, role: role as ProjectMember['role'] });
      toast.success('Role updated.');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (projectsLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex items-center gap-2 text-[var(--text-tertiary)]">
          <div className="w-2 h-2 rounded-full bg-current" />
          <div className="w-2 h-2 rounded-full bg-current" />
          <div className="w-2 h-2 rounded-full bg-current" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-6 mb-8">
        <Link
          to={`/projects/${id}`}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all shadow-sm shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-[28px] italic text-[var(--text-primary)] leading-tight">
            {project.name} Team
          </h1>
          <p className="text-[12px] text-[var(--text-secondary)] font-medium mt-1">
            Manage members and permissions for this project.
          </p>
        </div>
      </div>

      <section className="bg-white border border-[var(--border-subtle)] rounded-2xl shadow-sm overflow-hidden text-left">
        <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-black flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> Project Roster ({members.length})
          </label>
          {isAdmin && (
            <button 
              onClick={() => setIsInviting(!isInviting)}
              className={cn(
                "h-9 px-4 text-white text-[12px] font-bold rounded-xl shadow-md transition-colors",
                isInviting ? "bg-slate-500 hover:bg-slate-600" : "bg-[var(--text-primary)] hover:bg-[var(--accent)]"
              )}
            >
              {isInviting ? 'Cancel' : '+ Invite Member'}
            </button>
          )}
        </div>

        {isInviting && isAdmin && (
          <form onSubmit={handleAddMember} className="border-b border-[var(--border-subtle)] bg-[var(--bg-raised)] p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="font-bold text-[var(--text-primary)] text-sm mb-2">Target Collaborator</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <Input
                    required
                    type="email"
                    placeholder="Enter their email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 h-11 bg-[var(--bg-surface)] border-[var(--border-default)] shadow-sm focus-visible:ring-[var(--accent)]"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-widest pl-1">Project Role</label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as ProjectMember['role'])}>
                  <SelectTrigger className="w-full h-11 bg-[var(--bg-surface)] border-[var(--border-default)] shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="architect">Architect</SelectItem>
                    <SelectItem value="lead">Project Lead</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3">
                <Button 
                  type="submit" 
                  disabled={addMemberMutation.isPending || !email}
                  className="w-full h-11 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg shadow-md"
                >
                  {addMemberMutation.isPending ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
            </div>
          </form>
        )}
        
        {members.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-[var(--bg-raised)] rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[var(--text-tertiary)] opacity-50" />
             </div>
             <p className="text-[14px] font-bold text-[var(--text-primary)] mb-1">No Team Members</p>
             <p className="text-[12px] text-[var(--text-secondary)]">Invite people to collaborate on this project.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {members.map((m) => {
              const name = m.profile?.full_name || m.profile?.email || 'Unknown User';
              const initials = name.substring(0, 2).toUpperCase();
              
              let roleColor = 'bg-slate-100 text-slate-700';
              if (m.role === 'lead') roleColor = 'bg-purple-100 text-purple-700';
              if (m.role === 'architect') roleColor = 'bg-blue-100 text-blue-700';
              if (m.role === 'editor') roleColor = 'bg-emerald-100 text-emerald-700';
              if (m.role === 'viewer') roleColor = 'bg-orange-100 text-orange-700';

              return (
                <div key={m.id} className="p-5 flex items-center justify-between hover:bg-[var(--bg-raised)] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm bg-gradient-to-br from-[#7C3AED] to-[#1F6FEB] text-white">
                      {initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[var(--text-primary)]">{name}</span>
                      <span className="text-[11px] text-[var(--text-tertiary)] font-medium">Joined {m.joined_at ? format(new Date(m.joined_at), 'MMM yyyy') : 'Recently'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {isAdmin && m.user_id !== project.created_by ? (
                      <Select value={m.role} onValueChange={(val) => handleUpdateRole(m.user_id, val)}>
                        <SelectTrigger className={cn("h-8 text-[11px] font-bold uppercase tracking-wider w-[120px] rounded-lg border-transparent shadow-sm hover:border-[var(--border-subtle)] focus:ring-0", roleColor)}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-[120px]">
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="architect">Architect</SelectItem>
                          <SelectItem value="lead">Project Lead</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="consultant">Consultant</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={cn("text-[9px] font-mono tracking-widest px-3 py-1.5 rounded-full text-center min-w-[70px] font-black uppercase shadow-sm", roleColor)}>
                        {m.role}
                      </span>
                    )}

                    {isAdmin && m.user_id !== project.created_by ? (
                      <button 
                        onClick={() => handleRemoveMember(m.user_id, name)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 transition-all bg-white border border-transparent rounded-lg hover:border-red-100 hover:bg-red-50 hover:shadow-sm"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
