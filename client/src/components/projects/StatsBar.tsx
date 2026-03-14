import { Card, CardContent } from '../ui/card';
import { LayoutDashboard, AlertCircle, Users } from 'lucide-react';

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
    },
    {
      label: 'Overdue',
      value: overdueCount,
      icon: AlertCircle,
      color: 'text-red-500',
    },
    {
      label: 'Team Utilization',
      value: `${teamUtilization}%`,
      icon: Users,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-tertiary)] font-medium mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                {stat.value}
              </h3>
            </div>
            <div className={`p-3 rounded-full bg-slate-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
