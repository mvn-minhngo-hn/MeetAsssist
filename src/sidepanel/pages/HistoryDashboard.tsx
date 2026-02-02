import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useExtensionStore } from '@/store/useExtensionStore';
import type { Meeting, Category } from '@/types';

type ViewType = 'calendar' | 'timeline' | 'grid';
type FilterType = 'all' | 'today' | 'this-week' | 'this-month' | 'custom';

export default function HistoryDashboard() {
  const { meetings, categories } = useExtensionStore();
  const [viewType, setViewType] = useState<ViewType>('timeline');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filter meetings based on search and filters
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = !searchQuery || 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || meeting.categories.includes(selectedCategory);
    
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
    setSelectedMeeting(meeting);
  };

  const handleBackToDashboard = () => {
    setSelectedMeeting(null);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm('Bạn có chắc muốn xóa cuộc họp này?')) {
      // TODO: Implement delete via Firestore
      const updatedMeetings = meetings.filter(m => m.id !== meetingId);
      // useExtensionStore.getState().setMeetings(updatedMeetings);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Meeting History</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterPanel(true)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            {viewType === 'calendar' ? 'Timeline' : 'Calendar'}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{meetings.length} meetings</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {meetings.reduce((total, m) => total + (m.duration || 0), 0)} / 3600
            </span>
            <span>hours</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings..."
              className="w-full pl-10 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Filter Panel (Collapsible) */}
      {showFilterPanel && (
        <div className="border-b border-border bg-muted/50 p-4">
          <div className="space-y-4">
            {/* Date Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2">Date Range</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'today', 'this-week', 'this-month'] as FilterType[]).map((filter) => (
                  <Button
                    key={filter}
                    variant={filterType === filter ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterType(filter)}
                    className={cn(
                      'text-xs',
                      filterType === filter
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {filter === 'all' && 'All'}
                    {filter === 'today' && 'Today'}
                    {filter === 'this-week' && 'This Week'}
                    {filter === 'this-month' && 'This Month'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterPanel(false)}
              className="w-full"
            >
              Close Filters
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedMeeting ? (
        <MeetingDetail meeting={selectedMeeting} onBack={handleBackToDashboard} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No meetings found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedCategory !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Your meeting history will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {filteredMeetings.map((meeting) => (
                <MeetingListItem
                  key={meeting.id}
                  meeting={meeting}
                  onView={handleViewMeeting}
                  onDelete={handleDeleteMeeting}
                />
              ))}
            </div>
          )}
        </div>
    </div>
  );
}

