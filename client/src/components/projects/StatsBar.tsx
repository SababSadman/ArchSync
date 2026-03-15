import { Card, CardContent } from '../ui/card';
import { LayoutDashboard, AlertCircle, Users, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  totalActive: number;
  overdueCount: number;
  teamUtilization: number;
}

export function StatsBar({ totalActive, overdueCount, teamUtilization }: StatsBarProps) {
  const stats = [
    {
      label: 'Active Projects',
      value: totalActive,
      icon: LayoutDashboard,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      label: 'Overdue',
      value: overdueCount,
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
      borderColor: 'border-red-100',
    },
    {
      label: 'Team Utilization',
      value: `${teamUtilization}%`,
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="group overflow-hidden bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                    {stat.value}
                  </h3>
                  {stat.label === 'Team Utilization' && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      +2%
                    </span>
                  )}
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 shadow-sm border ${stat.borderColor}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            
            {/* Subtle Progress Bar for Capacity/Utilization */}
            {stat.label === 'Team Utilization' && (
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${teamUtilization}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
