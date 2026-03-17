import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Settings, 
  Cpu, 
  Bell, 
  Eye, 
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-950 border-white/5 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-emerald-500" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tight">Studio Settings</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Configure your ArchSync environment and automation preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
          {/* AI Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">AI & Automation</h4>
            </div>
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold">Smart AI Naming</Label>
                    <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">Auto-suggest filenames based on project phase.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between opacity-50 pointer-events-none">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">Auto-Changelog</Label>
                  <p className="text-[11px] text-slate-500">Generate version notes using visual diffs.</p>
                </div>
                <Switch />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Collaborative Alerts</h4>
            </div>
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">Spatial Mentions</Label>
                  <p className="text-[11px] text-slate-500">Notify when tagged in a drawing pin.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">Real-time Presence</Label>
                  <p className="text-[11px] text-slate-500">Show when others are viewing the same asset.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
              </div>
            </div>
          </section>

          {/* Interface */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Environment</h4>
            </div>
            <div className="flex items-center justify-between pl-6">
               <div className="space-y-1">
                  <Label className="text-sm font-bold">Studio Theme</Label>
                  <p className="text-[11px] text-slate-500">Switch between light and architectural dark.</p>
                </div>
                <div className="flex bg-slate-900 border border-white/5 p-1 rounded-lg">
                  <Button variant="ghost" size="sm" className="h-7 px-3 gap-2 text-slate-400">
                    <Sun className="w-3.5 h-3.5" />
                    Light
                  </Button>
                  <Button variant="secondary" size="sm" className="h-7 px-3 gap-2 bg-slate-800 text-white border-white/5">
                    <Moon className="w-3.5 h-3.5" />
                    Slate
                  </Button>
                </div>
            </div>
          </section>
        </div>

        <DialogFooter className="pt-4 border-t border-white/5 flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
             <ShieldCheck className="w-3 h-3 text-emerald-500" />
             End-to-end encrypted metadata
          </div>
          <Button onClick={() => onOpenChange(false)} className="bg-emerald-500 hover:bg-emerald-600 h-9 px-6 font-bold">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
