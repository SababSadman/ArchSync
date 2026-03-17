import { useState, useMemo } from 'react';
import { Comment } from '../../hooks/use-comments';
import { ProjectMember } from '../../hooks/use-members';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Lock, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ClientFeedbackViewProps {
  comments: Comment[];
  currentUserRole?: string;
  isClient?: boolean;
  onFilterChange?: (filtered: Comment[]) => void;
  children: (filteredComments: Comment[]) => React.ReactNode;
}

export function ClientFeedbackView({ 
  comments, 
  currentUserRole, 
  isClient, 
  children 
}: ClientFeedbackViewProps) {
  const [showInternal, setShowInternal] = useState(!isClient);

  const filteredComments = useMemo(() => {
    if (isClient) {
      // Clients only see public comments
      return comments.filter(c => c.is_client_visible);
    }
    if (!showInternal) {
      // Team can choose to hide internal notes to see what client sees
      return comments.filter(c => c.is_client_visible);
    }
    return comments;
  }, [comments, isClient, showInternal]);

  return (
    <div className="flex flex-col h-full">
      {!isClient && (
        <div className="px-4 py-2 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-400 border-blue-500/20">
              Team View
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="internal-toggle" className="text-[10px] text-slate-400 font-bold uppercase cursor-pointer">
              {showInternal ? 'Internal Notes Visible' : 'Client View Only'}
            </Label>
            <Switch 
              id="internal-toggle"
              checked={showInternal}
              onCheckedChange={setShowInternal}
              className="scale-75 data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 min-h-0">
        {children(filteredComments)}
      </div>
    </div>
  );
}
