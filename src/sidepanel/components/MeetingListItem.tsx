import { format } from 'date-fns';
import { Clock, Calendar, MoreVertical, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Meeting } from '@/types';

interface MeetingListItemProps {
  meeting: Meeting;
  onView: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
  onToggleFavorite?: (meetingId: string) => void;
}

export default function MeetingListItem({ meeting, onView, onDelete, onToggleFavorite }: MeetingListItemProps) {
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}p ${remainingSeconds}s`;
  };

  const contextBadgeColors = {
    technical: 'bg-blue-500',
    business: 'bg-green-500',
    general: 'bg-gray-500',
  };

  return (
    <div
      onClick={() => onView(meeting)}
      className={cn(
        'p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors bg-background',
        onToggleFavorite && 'group'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Title and Date */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {meeting.title || `Meeting on ${formatDate(new Date(meeting.date))}`}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(new Date(meeting.date))}</span>
            </div>
          </div>

          {/* Context Badge */}
          <div
            className={cn(
              'px-2 py-1 rounded-full text-[10px] font-medium text-white',
              contextBadgeColors[meeting.context]
            )}
          >
            {meeting.context}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          {/* Duration Badge */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(meeting.duration)}</span>
          </div>

          {/* Action Items Count Badge */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center">
                {meeting.actionItems?.filter((item) => !item.completed).length || 0}
              </span>
              </span>
              pending
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Hover Actions */}
      {onToggleFavorite && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(meeting.id);
            }}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <Star className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(meeting.id);
            }}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

