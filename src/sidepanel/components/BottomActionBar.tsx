import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BottomActionBarProps {
  isCapturing: boolean;
  children?: ReactNode;
}

export default function BottomActionBar({ isCapturing, children }: BottomActionBarProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email']);

  const channels = [
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'slack', label: 'Slack', icon: '💬' },
    { id: 'teams', label: 'Teams', icon: '👥' },
    { id: 'discord', label: 'Discord', icon: '🎮' },
  ];

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSendNotes = () => {
    // TODO: Implement send notes functionality
    console.log('[MeetAssist] Sending notes to channels:', selectedChannels);

    // Send message to background
    chrome.runtime.sendMessage({
      type: 'SEND_EMAIL',
      payload: { channels: selectedChannels },
    });
  };

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-3 space-y-2">
      {/* Channel Selection */}
      <div className="flex flex-wrap gap-1">
        {channels.map((channel) => {
          const isSelected = selectedChannels.includes(channel.id);
          return (
            <button
              key={channel.id}
              onClick={() => toggleChannel(channel.id)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <span>{channel.icon}</span>
              {channel.label}
            </button>
          );
        })}
      </div>

      {/* Custom Children (Generate Summary Button) */}
      {children}

      {/* Send Button */}
      <Button
        onClick={handleSendNotes}
        disabled={isCapturing || selectedChannels.length === 0}
        className="w-full gap-2"
      >
        <Send className="w-4 h-4" />
        {isCapturing ? 'Capturing...' : 'End & Send Notes'}
      </Button>
    </div>
  );
}

