import * as nodemailer from 'nodemailer';

interface NotificationPayload {
  channels: {
    email?: {
      recipients: string[];
      subject?: string;
    };
    slack?: {
      webhookUrl: string;
      channel?: string;
    };
    teams?: {
      webhookUrl: string;
    };
    discord?: {
      webhookUrl: string;
    };
    webhook?: {
      url: string;
      method: 'POST' | 'PUT';
      headers: Record<string, string>;
    };
  };
  meetingData: {
    summary: string;
    actionItems: string[];
    suggestions: string[];
    transcript: any[];
    meetingContext: string;
    duration: number;
    startTime: string;
    endTime: string;
    participantCount?: number;
  };
  options: {
    includeTranscript: boolean;
    format: 'html' | 'markdown' | 'json';
  };
}

interface ChannelResult {
  success: boolean;
  error?: string;
}

/**
 * Main service to send meeting notes to multiple channels
 */
export async function sendMeetingNotes(payload: NotificationPayload): Promise<Record<string, ChannelResult>> {
  const results: Record<string, ChannelResult> = {};
  const { channels } = payload;

  // Send to email if configured
  if (channels.email && channels.email.recipients) {
    results.email = await sendEmail(channels.email, payload);
  }

  // Send to Slack if configured
  if (channels.slack && channels.slack.webhookUrl) {
    results.slack = await sendSlack(channels.slack, payload);
  }

  // Send to Teams if configured
  if (channels.teams && channels.teams.webhookUrl) {
    results.teams = await sendTeams(channels.teams, payload);
  }

  // Send to Discord if configured
  if (channels.discord && channels.discord.webhookUrl) {
    results.discord = await sendDiscord(channels.discord, payload);
  }

  // Send to custom webhook if configured
  if (channels.webhook && channels.webhook.url) {
    results.webhook = await sendWebhook(channels.webhook, payload);
  }

  return results;
}

/**
 * Send email notification
 */
async function sendEmail(
  config: { recipients: string[]; subject?: string },
  payload: NotificationPayload
): Promise<ChannelResult> {
  try {
    // For production, you would use a proper email service like:
    // - SendGrid
    // - Resend
    // - Nodemailer with SMTP

    // TODO: Configure proper email service
    // const transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });

    // For now, just log the email that would be sent
    console.log('[Email Service] Would send email to:', config.recipients);
    console.log('[Email Service] Subject:', config.subject || 'Meeting Notes');
    console.log('[Email Service] Content length:', payload.meetingData.summary.length);

    return { success: true };
  } catch (error) {
    console.error('[Email Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Slack notification
 */
async function sendSlack(
  config: { webhookUrl: string; channel?: string },
  payload: NotificationPayload
): Promise<ChannelResult> {
  try {
    const blocks = formatSlackBlocks(payload);

    const slackPayload = config.channel
      ? { ...blocks, channel: config.channel }
      : blocks;

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Slack Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Teams notification
 */
async function sendTeams(
  config: { webhookUrl: string },
  payload: NotificationPayload
): Promise<ChannelResult> {
  try {
    const adaptiveCard = formatTeamsCard(payload);

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adaptiveCard),
    });

    if (!response.ok) {
      throw new Error(`Teams API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Teams Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Discord notification
 */
async function sendDiscord(
  config: { webhookUrl: string },
  payload: NotificationPayload
): Promise<ChannelResult> {
  try {
    const embed = formatDiscordEmbed(payload);

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Discord Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send custom webhook notification
 */
async function sendWebhook(
  config: { url: string; method: 'POST' | 'PUT'; headers: Record<string, string> },
  payload: NotificationPayload
): Promise<ChannelResult> {
  try {
    const response = await fetch(config.url, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Webhook Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format meeting notes as Slack blocks
 */
function formatSlackBlocks(payload: NotificationPayload): { blocks: any[] } {
  const { meetingData } = payload;
  const { summary, actionItems, suggestions, duration, startTime, participantCount } = meetingData;

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

  // Add action items
  if (actionItems.length > 0) {
    blocks.push(
      { type: 'divider' },
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

  // Add suggestions
  if (suggestions.length > 0) {
    blocks.push(
      { type: 'divider' },
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

  blocks.push(
    { type: 'divider' },
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

/**
 * Format meeting notes as Teams adaptive card
 */
function formatTeamsCard(payload: NotificationPayload): any {
  const { meetingData } = payload;
  const { summary, actionItems, suggestions, duration, startTime, participantCount } = meetingData;

  return {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.2',
          body: [
            {
              type: 'TextBlock',
              text: '📋 Meeting Notes',
              size: 'Large',
              weight: 'Bolder',
            },
            {
              type: 'FactSet',
              facts: [
                {
                  title: 'Context',
                  value: meetingData.meetingContext,
                },
                {
                  title: 'Duration',
                  value: `${Math.floor(duration / 60)}p`,
                },
                {
                  title: 'Participants',
                  value: participantCount || 'N/A',
                },
              ],
            },
            {
              type: 'TextBlock',
              text: 'Tóm Tắt',
              weight: 'Bolder',
              spacing: 'Medium',
            },
            {
              type: 'TextBlock',
              text: summary,
              wrap: true,
            },
            ...(actionItems.length > 0
              ? [
                  {
                    type: 'TextBlock',
                    text: 'Các Việc Cần Làm',
                    weight: 'Bolder',
                    spacing: 'Medium',
                  },
                  ...actionItems.map((item) => ({
                    type: 'Input.Text',
                    id: `item-${item}`,
                    value: item,
                    isMultiline: true,
                  })),
                ]
              : []),
          ],
        },
      },
    ],
  };
}

/**
 * Format meeting notes as Discord embed
 */
function formatDiscordEmbed(payload: NotificationPayload): any {
  const { meetingData } = payload;
  const { summary, actionItems, suggestions, duration, startTime, participantCount } = meetingData;

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

  const embeds = [
    {
      title: '📋 Meeting Notes',
      color: 0x3b82f6, // Blue
      fields: [
        {
          name: 'Context',
          value: meetingData.meetingContext,
          inline: true,
        },
        {
          name: 'Duration',
          value: `${Math.floor(duration / 60)}p ${duration % 60}s`,
          inline: true,
        },
        {
          name: 'Participants',
          value: participantCount?.toString() || 'N/A',
          inline: true,
        },
      ],
      description: summary,
      footer: {
        text: `Powered by MeetAssist • AI-powered meeting assistant`,
      },
      timestamp: startTime,
    },
  ];

  // Add suggestions in separate embed
  if (suggestions.length > 0) {
    embeds.push({
      title: '💡 Gợi ý',
      color: 0xf59e0b, // Orange
      fields: suggestions.map((suggestion) => ({
        name: `Suggestion ${suggestions.indexOf(suggestion) + 1}`,
        value: suggestion,
      })),
    });
  }

  return { embeds };
}

