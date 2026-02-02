import type { User, Meeting, Category, ActionItem, ContextType, AIProvider, CaptionChunk } from '@/types';

// For now, this is a mock implementation
// In production, you would initialize Firebase Admin SDK
// const admin = require('firebase-admin');
// const db = admin.firestore();

/**
 * Initialize Firebase Firestore (for production use)
 *
 * Note: This requires Firebase configuration
 * You would set this up in Firebase Console and add the config
 */

interface CreateMeetingParams {
  userId: string;
  title: string;
  date: Date;
  duration: number;
  context: ContextType;
  categories: string[];
  summary: string;
  actionItems: string[];
  suggestions: string[];
  transcript: CaptionChunk[];
  participantCount: number;
  aiProvider: AIProvider;
  aiModel: string;
  tokenUsage: number;
}

/**
 * Create a new meeting document
 */
export async function createMeeting(params: CreateMeetingParams): Promise<Meeting> {
  // Mock implementation - stores in Chrome local storage
  const meeting: Meeting = {
    id: crypto.randomUUID(),
    userId: params.userId,
    title: params.title || 'Meeting on ' + params.date.toLocaleDateString('vi-VN'),
    date: params.date,
    duration: params.duration,
    context: params.context,
    categories: params.categories,
    summary: params.summary,
    actionItems: params.actionItems.map((text, index) => ({
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: params.date,
    })),
    suggestions: params.suggestions,
    transcript: params.transcript.map((c) => ({
      speaker: c.speaker,
      text: c.text,
      timestamp: c.timestamp,
      transcriptId: c.transcriptId,
    })).join('\n'),
    participantCount: params.participantCount,
    aiProvider: params.aiProvider,
    aiModel: params.aiModel,
    tokenUsage: params.tokenUsage,
    createdAt: params.date,
    updatedAt: params.date,
  };

  // Store in Chrome local storage (in production, use Firebase)
  const result = await chrome.storage.local.get(['meetings']);
  const meetings: Meeting[] = result.meetings || [];
  meetings.unshift(meeting);
  
  await chrome.storage.local.set({ meetings });

  return meeting;
}

/**
 * Get all meetings for a user
 */
export async function getMeetings(userId: string): Promise<Meeting[]> {
  const result = await chrome.storage.local.get(['meetings']);
  const meetings: Meeting[] = result.meetings || [];
  
  // Filter by user ID
  return meetings.filter(m => m.userId === userId);
}

/**
 * Get a specific meeting by ID
 */
export async function getMeetingById(meetingId: string): Promise<Meeting | null> {
  const result = await chrome.storage.local.get(['meetings']);
  const meetings: Meeting[] = result.meetings || [];
  
  return meetings.find(m => m.id === meetingId) || null;
}

/**
 * Update a meeting
 */
export async function updateMeeting(
  meetingId: string,
  updates: Partial<Meeting>
): Promise<Meeting | null> {
  const result = await chrome.storage.local.get(['meetings']);
  const meetings: Meeting[] = result.meetings || [];
  
  const index = meetings.findIndex(m => m.id === meetingId);
  if (index === -1) {
    return null;
  }

  meetings[index] = { ...meetings[index], ...updates, updatedAt: new Date() };
  
  await chrome.storage.local.set({ meetings });
  
  return meetings[index];
}

/**
 * Delete a meeting
 */
export async function deleteMeeting(meetingId: string): Promise<boolean> {
  const result = await chrome.storage.local.get(['meetings']);
  const meetings: Meeting[] = result.meetings || [];
  
  const filteredMeetings = meetings.filter(m => m.id !== meetingId);
  
  if (filteredMeetings.length === meetings.length) {
    return false; // No meeting was deleted
  }

  await chrome.storage.local.set({ meetings: filteredMeetings });
  return true;
}

/**
 * Create a category
 */
export async function createCategory(
  userId: string,
  name: string,
  color: string,
  icon: string
): Promise<Category> {
  const category: Category = {
    id: crypto.randomUUID(),
    userId,
    name,
    color,
    icon,
    meetingCount: 0,
    createdAt: new Date(),
  };

  const result = await chrome.storage.local.get(['categories']);
  const categories: Category[] = result.categories || [];
  categories.push(category);
  
  await chrome.storage.local.set({ categories });

  return category;
}

/**
 * Get all categories for a user
 */
export async function getCategories(userId: string): Promise<Category[]> {
  const result = await chrome.storage.local.get(['categories']);
  const categories: Category[] = result.categories || [];
  
  return categories.filter(c => c.userId === userId);
}

/**
 * Update category
 */
export async function updateCategory(
  categoryId: string,
  updates: Partial<Category>
): Promise<Category | null> {
  const result = await chrome.storage.local.get(['categories']);
  const categories: Category[] = result.categories || [];
  
  const index = categories.findIndex(c => c.id === categoryId);
  if (index === -1) {
    return null;
  }

  categories[index] = { ...categories[index], ...updates };
  
  await chrome.storage.local.set({ categories });
  
  return categories[index];
}

/**
 * Delete category
 */
export async function deleteCategory(categoryId: string): Promise<boolean> {
  const result = await chrome.storage.local.get(['categories']);
  const categories: Category[] = result.categories || [];
  
  const filteredCategories = categories.filter(c => c.id !== categoryId);
  
  if (filteredCategories.length === categories.length) {
    return false; // No category was deleted
  }

  await chrome.storage.local.set({ categories: filteredCategories });
  return true;
}

/**
 * Save user profile
 */
export async function saveUserProfile(user: User): Promise<void> {
  const result = await chrome.storage.local.get(['users']);
  const users: User[] = result.users || [];
  
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  await chrome.storage.local.set({ users });
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const result = await chrome.storage.local.get(['users']);
  const users: User[] = result.users || [];
  
  return users.find(u => u.id === userId) || null;
}

