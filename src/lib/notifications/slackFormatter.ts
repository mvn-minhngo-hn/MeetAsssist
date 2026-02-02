import type { NotificationPayload } from '@/types';

export function formatSlackBlocks(payload: NotificationPayload): any {
  const { meetingData, options } = payload;
  const { summary, actionItems, suggestions, duration, startTime, endTime, participantCount } = meetingData;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}p ${remainingSeconds}s`;
  };

  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '📋 Meeting Notes',
        emoji: true,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Context:* ${meetingData.meetingContext}\n*Date:* ${formatDate(startTime)}\n*Duration:* ${formatDuration(duration)}\n*Participants:* ${participantCount || 'N/A'}`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Tóm Tắt*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: summary,
      },
    },
  ];

  // Add action items if present
  if (actionItems.length > 0) {
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Các Việc Cần Làm*',
        },
      },
      ...actionItems.map((item) => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:white_check_mark: ${item}`,
        },
      }))
    );
  }

  // Add suggestions if present
  if (suggestions.length > 0) {
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:bulb: *Gợi ý*`,
        },
      },
      ...suggestions.map((suggestion) => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:bulb: ${suggestion}`,
        },
      }))
    );
  }

  // Add transcript section if requested
  if (options.includeTranscript && meetingData.transcript.length > 0) {
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Bản Ghi Chi Tiết*',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: meetingData.transcript.map(caption => `*${caption.speaker}*: ${caption.text}`).join('\n\n'),
          },
        ],
      }
    );
  }

  blocks.push(
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Powered by *MeetAssist* • AI-powered meeting assistant`,
        },
      ],
    }
  );

  return { blocks };
}

