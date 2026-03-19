import React from 'react';
import { cn } from '../../../lib/utils';

interface Task {
  id: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignee: { name: string; initials: string; avatarUrl?: string };
}

interface WorkloadViewProps {
  tasks: Task[];
  members: any[];
  projectName: string;
}

export function WorkloadView({ tasks, members, projectName }: WorkloadViewProps) {
  const memberWorkload = members.map(member => {
    const memberTasks = tasks.filter(t => t.assignee.name === member.full_name);
    const todoCount = memberTasks.filter(t => t.status === 'todo').length;
    const progressCount = memberTasks.filter(t => t.status === 'in_progress').length;
    const doneCount = memberTasks.filter(t => t.status === 'done' || t.status === 'review').length;
    const totalCount = memberTasks.length;

    return {
      member,
      todoCount,
      progressCount,
      doneCount,
      totalCount
    };
  });

  return (
    <div className="bg-white border border-[var(--border-default)] rounded-[24px] p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-[1px] bg-[var(--accent)]" />
        <h3 className="font-mono text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em]">
          Team Workload
        </h3>
      </div>
      <p className="text-[14px] text-[var(--text-secondary)] mb-8">
        Task distribution across team members for <span className="font-bold text-[var(--text-primary)]">{projectName}</span>
      </p>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <span className="text-[12px] font-bold text-[var(--text-secondary)]">To Do</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#D97706]" />
          <span className="text-[12px] font-bold text-[var(--text-secondary)]">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="text-[12px] font-bold text-[var(--text-secondary)]">Done</span>
        </div>
      </div>

      <div className="space-y-8">
        {memberWorkload.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">
            <p className="text-[var(--text-tertiary)] font-medium italic font-serif">No assignments yet for this project.</p>
          </div>
        ) : memberWorkload.map(({ member, todoCount, progressCount, doneCount, totalCount }) => {
          const todoPercent = totalCount > 0 ? (todoCount / 10) * 100 : 0; // Using 10 as base for visualization like in image
          const progressPercent = totalCount > 0 ? (progressCount / 10) * 100 : 0;
          const donePercent = totalCount > 0 ? (doneCount / 10) * 100 : 0;

          return (
            <div key={member.id} className="flex items-center gap-6 group">
              <div className="flex items-center gap-3 w-[180px] shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: member.avatar_color || 'var(--accent)' }}
                >
                  {member.full_name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <span className="text-[14px] font-bold text-[var(--text-primary)] truncate">{member.full_name}</span>
              </div>

              <div className="flex-1 h-8 bg-[var(--bg-raised)] rounded-lg overflow-hidden flex relative group/bar">
                 {/* To Do Segment */}
                 <div 
                  className="h-full bg-[#3B82F6] transition-all duration-700 flex items-center justify-center"
                  style={{ width: `${(todoCount / 12) * 100}%` }}
                >
                  {todoCount > 0 && <span className="text-[10px] font-black text-white">{todoCount}</span>}
                </div>
                
                {/* In Progress Segment */}
                <div 
                  className="h-full bg-[#D97706] transition-all duration-700 delay-100 flex items-center justify-center border-l border-white/20"
                  style={{ width: `${(progressCount / 12) * 100}%` }}
                >
                  {progressCount > 0 && <span className="text-[10px] font-black text-white">{progressCount}</span>}
                </div>

                {/* Done Segment */}
                <div 
                  className="h-full bg-[#10B981] transition-all duration-700 delay-200 flex items-center justify-center border-l border-white/20"
                  style={{ width: `${(doneCount / 12) * 100}%` }}
                >
                  {doneCount > 0 && <span className="text-[10px] font-black text-white">{doneCount}</span>}
                </div>
              </div>

              <div className="w-[60px] text-right">
                <p className="text-[16px] font-serif italic font-bold text-[var(--text-secondary)]">{totalCount}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)] -mt-1">tasks</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
