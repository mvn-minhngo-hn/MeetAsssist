import { useExtensionStore } from '@/store/useExtensionStore';
import { Search, Filter, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Meeting, Category } from '@/types';

type ViewType = 'calendar' | 'timeline' | 'grid';
type FilterType = 'all' | 'today' | 'this-week' | 'this-month' | 'custom';

export default function HistoryDashboard() {
  const { meetings, categories } = useExtensionStore();
  const [viewType, setViewType] = useState<ViewType>('timeline');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter meetings based on search and filters
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = !searchQuery || 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = true; // Show all for now
    
    const matchesDateFilter = filterType === 'all' || matchesDateFilter(meeting, filterType);
    
    return matchesSearch && matchesCategory && matchesDateFilter;
  });

  function matchesDateFilter(meeting: Meeting, filter: FilterType): boolean {
    const now = new Date();
    const meetingDate = new Date(meeting.date);
    
    switch (filter) {
      case 'today':
        return meetingDate.toDateString() === now.toDateString();
      case 'this-week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return meetingDate >= weekAgo;
      case 'this-month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        return meetingDate >= monthAgo;
      default:
        return true;
    }
  }

  const handleViewMeeting = (meeting: Meeting) => {
    // Navigate to detail view - to be implemented
    console.log('[HistoryDashboard] Viewing meeting:', meeting.id);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm('Bạn có chắc muốn xóa cuộc họp này?')) {
      const updatedMeetings = meetings.filter(m => m.id !== meetingId);
      setMeetings(updatedMeetings);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Meeting History</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
            >
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{meetings.length} meetings</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {meetings.reduce((total, m) => total + (m.duration || 0), 0)} / 3600
            </span>
            <span>hours</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* No meetings state */}
        {filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No meetings found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Your meeting history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => handleViewMeeting(meeting)}
                className={cn(
                  'p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors',
                  'bg-background hover:bg-muted/50'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {meeting.title || `Meeting on ${new Date(meeting.date).toLocaleDateString('vi-VN')}`}
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {new Date(meeting.date).toLocaleString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(meeting.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(meeting.duration / 60)}p {meeting.duration % 60}s</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

