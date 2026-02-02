import type { NotificationChannel } from '@/types';

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  {
    id: 'email',
    name: 'Email',
    icon: '✉️',
    enabled: true,
    config: {
      recipients: '',
      subject: '',
    },
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    enabled: false,
    config: {
      webhookUrl: '',
      channel: '',
    },
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: '👥',
    enabled: false,
    config: {
      webhookUrl: '',
    },
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    enabled: false,
    config: {
      webhookUrl: '',
    },
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    icon: '🔗',
    enabled: false,
    config: {
      url: '',
      method: 'POST',
      headers: JSON.stringify({}),
    },
  },
];

export function getChannelConfig(channelId: string): NotificationChannel | undefined {
  return NOTIFICATION_CHANNELS.find((channel) => channel.id === channelId);
}

export function validateChannelConfig(channelId: string, config: Record<string, string>): boolean {
  switch (channelId) {
    case 'email':
      return !!(config.recipients && config.recipients.length > 0);
    case 'slack':
      return !!(config.webhookUrl && config.webhookUrl.startsWith('https://hooks.slack.com/'));
    case 'teams':
      return !!(config.webhookUrl && config.webhookUrl.includes('office.com'));
    case 'discord':
      return !!(config.webhookUrl && config.webhookUrl.startsWith('https://discord.com/api/webhooks/'));
    case 'webhook':
      return !!(config.url && config.url.startsWith('https://'));
    default:
      return false;
  }
}

