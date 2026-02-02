export type ContextType = 'technical' | 'business' | 'general';
export type AIProvider = 'glm' | 'openai' | 'gemini';

export interface CaptionChunk {
  speaker: string;
  text: string;
  timestamp: number;
  transcriptId: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  userId: string;
  title: string;
  date: Date;
  duration: number; // seconds
  context: ContextType;
  categories: string[];
  summary: string;
  actionItems: ActionItem[];
  suggestions: string[];
  transcript: string;
  participantCount: number;
  aiProvider: AIProvider;
  aiModel: string;
  tokenUsage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  meetingCount: number;
  createdAt: Date;
}

export type MessageType =
  | 'CAPTION_CHUNK_RECEIVED'
  | 'CAPTION_STREAM_STOPPED'
  | 'START_CAPTURE'
  | 'STOP_CAPTURE'
  | 'SEND_EMAIL'
  | 'SUMMARY_UPDATE'
  | 'SUGGESTION_UPDATE'
  | 'CAPTION_ERROR';

export interface ExtensionMessage {
  type: MessageType;
  payload?: any;
}

export interface NotificationChannel {
  id: 'email' | 'slack' | 'teams' | 'discord' | 'webhook';
  name: string;
  icon: string;
  enabled: boolean;
  config: {
    [key: string]: string;
  };
}

export interface NotificationPayload {
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
    transcript: CaptionChunk[];
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

