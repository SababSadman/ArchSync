import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';

interface FilterBarProps {
  filters: { status: string; phase: string; search: string };
  setFilters: (filters: any) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export function FilterBar({ filters, setFilters, sortBy, setSortBy }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
      <div className="flex flex-1 w-full md:w-auto gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-[var(--bg-surface)] border-[var(--border-default)] h-10"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        <Select
          value={filters.status}
          onValueChange={(val) => setFilters({ ...filters, status: val })}
        >
          <SelectTrigger className="w-[140px] bg-[var(--bg-surface)] border-[var(--border-default)] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.phase}
          onValueChange={(val) => setFilters({ ...filters, phase: val })}
        >
          <SelectTrigger className="w-[160px] bg-[var(--bg-surface)] border-[var(--border-default)] h-10">
            <SelectValue placeholder="Phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            <SelectItem value="schematic">Schematic</SelectItem>
            <SelectItem value="design_dev">Design Dev</SelectItem>
            <SelectItem value="construction_docs">Const. Docs</SelectItem>
            <SelectItem value="closeout">Closeout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-tertiary)] font-medium">SORT BY</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px] bg-[var(--bg-surface)] border-[var(--border-default)] h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="updated_at">Last Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
