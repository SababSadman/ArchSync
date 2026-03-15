import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, SlidersHorizontal, ListFilter } from 'lucide-react';

interface FilterBarProps {
  filters: { status: string; phase: string; search: string };
  setFilters: (filters: any) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export function FilterBar({ filters, setFilters, sortBy, setSortBy }: FilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-2 items-center justify-between">
      <div className="flex flex-col sm:flex-row flex-1 w-full lg:w-auto gap-3 items-center">
        <div className="relative flex-1 w-full sm:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
          <Input
            placeholder="Search within portfolio..."
            className="pl-10 bg-transparent border-none h-11 focus-visible:ring-0 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        <div className="h-6 w-[1px] bg-[var(--border-subtle)] hidden sm:block mx-2" />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
            <ListFilter className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <Select
              value={filters.status}
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            >
              <SelectTrigger className="w-[120px] border-none bg-transparent h-7 focus:ring-0 p-0 text-xs font-bold uppercase tracking-wider">
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
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <Select
              value={filters.phase}
              onValueChange={(val) => setFilters({ ...filters, phase: val })}
            >
              <SelectTrigger className="w-[140px] border-none bg-transparent h-7 focus:ring-0 p-0 text-xs font-bold uppercase tracking-wider">
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
        </div>
      </div>

      <div className="flex items-center gap-3 self-end lg:self-auto px-4 py-2 border-l border-[var(--border-subtle)] hidden lg:flex">
        <span className="text-[10px] text-[var(--text-tertiary)] font-black uppercase tracking-widest whitespace-nowrap">Sort By</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[130px] border-none bg-transparent h-7 focus:ring-0 p-0 text-xs font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Project Name</SelectItem>
            <SelectItem value="deadline">Deadline Urgency</SelectItem>
            <SelectItem value="updated_at">Last Activity</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
