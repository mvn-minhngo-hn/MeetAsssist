import { useState } from 'react';
import { ArrowLeft, Edit2, Share2, Trash2, Download, CheckSquare2, Lightbulb, Copy, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Meeting, ActionItem } from '@/types';
import { format } from 'date-fns';

interface MeetingDetailProps {
  meeting: Meeting;
  onBack: () => void;
}

export default function MeetingDetail({ meeting, onBack }: MeetingDetailProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [localMeeting, setLocalMeeting] = useState(meeting);
  const [expandedSection, setExpandedSection] = useState<string>('summary');
  const [activeActionItems, setActiveActionItems] = useState(
    meeting.actionItems.map((item) => ({ ...item, completed: item.completed || false }))
  );

  const formatDate = (date: Date) => {
    return format(date, 'MMMM dd, yyyy \'at\' HH:mm');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}p ${remainingSeconds}s`;
  };

  const handleSaveTitle = () => {
    // TODO: Implement save to Firestore
    setEditingTitle(false);
  };

  const handleToggleActionItem = (id: string) => {
    setActiveActionItems(
      activeActionItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteMeeting = () => {
    if (confirm('Bạn có chắc muốn xóa cuộc họp này?')) {
      // TODO: Implement delete from Firestore
      onBack();
    }
  };

  const handleShare = () => {
    // Copy meeting summary to clipboard
    const shareText = `
${localMeeting.title}
Date: ${formatDate(new Date(localMeeting.date))}

Tóm Tắt:
${localMeeting.summary}

Các việc cần làm:
${activeActionItems.map((item, index) => {
  return `${index + 1}. [${item.completed ? 'x' : ' '}] ${item.text}`;
}).join('\n')}
    `.trim();

    navigator.clipboard.writeText(shareText);
    alert('Đã sao chép vào clipboard! Bạn có thể dán vào email hoặc Slack.');
  };

  const handleCopySection = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép!');
  };

  const exportToCSV = () => {
    const csvContent = [
      'Title,Date,Duration,Context,Summary,Action Items,Suggestions',
      [
        localMeeting.title,
        formatDate(new Date(localMeeting.date)),
        formatDuration(localMeeting.duration),
        localMeeting.context,
        localMeeting.summary,
        activeActionItems.map((item) => item.text).join(';'),
        localMeeting.suggestions.join(';'),
      ],
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-${localMeeting.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = activeActionItems.filter((item) => item.completed).length;
  const totalCount = activeActionItems.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const contextBadgeColors = {
    technical: 'bg-blue-500',
    business: 'bg-green-500',
    general: 'bg-gray-500',
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {editingTitle ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localMeeting.title}
                  onChange={(e) => setLocalMeeting({ ...localMeeting, title: e.target.value })}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="text-lg font-semibold bg-transparent border-b border-border focus:outline-none flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveTitle}>
                  Save
                </Button>
              </div>
            ) : (
              <div
                onClick={() => setEditingTitle(true)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <h1 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {localMeeting.title}
                </h1>
                <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportToCSV}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteMeeting}
                className="gap-2 text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground border-t border-border pt-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(new Date(localMeeting.date))}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(localMeeting.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckSquare2 className="w-3 h-3" />
            <span>{completedCount}/{totalCount} completed</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6 max-w-3xl mx-auto">
          {/* Summary Section */}
          <div>
            <button
              onClick={() => setExpandedSection('summary')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="text-lg font-semibold text-foreground">Tóm Tắt</h2>
              {expandedSection === 'summary' ? (
                <ArrowLeft className="w-5 h-5 transform rotate-90" />
              ) : (
                <ArrowLeft className="w-5 h-5 transform -rotate-90" />
              )}
            </button>
            {expandedSection === 'summary' && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {localMeeting.summary}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopySection(localMeeting.summary)}
                  className="mt-3 gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Summary
                </Button>
              </div>
            )}
          </div>

          {/* Action Items Section */}
          <div>
            <button
              onClick={() => setExpandedSection('actions')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="text-lg font-semibold text-foreground">
                Các Việc Cần Làm
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({completedCount}/{totalCount})
                </span>
              </h2>
              {expandedSection === 'actions' ? (
                <ArrowLeft className="w-5 h-5 transform rotate-90" />
              ) : (
                <ArrowLeft className="w-5 h-5 transform -rotate-90" />
              )}
            </button>
            {expandedSection === 'actions' && (
              <div className="space-y-2">
                {activeActionItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-md border bg-background hover:border-primary/50 transition-colors',
                      item.completed
                        ? 'border-success/50 opacity-60'
                        : 'border-border'
                    )}
                  >
                    <button
                      onClick={() => handleToggleActionItem(item.id)}
                      className={cn(
                        'mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0',
                        item.completed
                          ? 'bg-success border-success text-white'
                          : 'border-border hover:border-primary'
                      )}
                    >
                      {item.completed && <CheckSquare2 className="w-3 h-3" />}
                    </button>
                    <span
                      className={cn(
                        'flex-1 text-sm leading-relaxed',
                        item.completed
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                      )}
                    >
                      {item.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopySection(item.text)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground ml-auto"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {activeActionItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No action items</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suggestions Section */}
          {localMeeting.suggestions && localMeeting.suggestions.length > 0 && (
            <div>
              <button
                onClick={() => setExpandedSection('suggestions')}
                className="w-full flex items-center justify-between mb-3"
              >
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Gợi ý
                </h2>
                {expandedSection === 'suggestions' ? (
                  <ArrowLeft className="w-5 h-5 transform rotate-90" />
                ) : (
                  <ArrowLeft className="w-5 h-5 transform -rotate-90" />
                )}
              </button>
              {expandedSection === 'suggestions' && (
                <div className="space-y-3">
                  {localMeeting.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-md bg-warning/5 border border-warning/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-warning text-white flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-3 h-3" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed text-foreground">
                            {suggestion}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopySection(suggestion)}
                            className="mt-2 gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

