import type { ExtensionMessage, CaptionChunk } from '@/types';
import { handleAIProcessing } from './aiScheduler';

console.log('[MeetAssist] Background service worker initialized');

// Store for caption buffers
const captionBuffers = new Map<string, CaptionChunk[]>();

// Listen for messages from content script and side panel
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  console.log('[MeetAssist] Received message:', message.type);

  switch (message.type) {
    case 'CAPTION_CHUNK_RECEIVED':
      handleCaptionChunk(message.payload);
      break;

    case 'CAPTION_STREAM_STOPPED':
      handleCaptionStreamStopped(message.payload);
      break;

    case 'START_CAPTURE':
      handleStartCapture(message.payload, sender.tab?.id);
      break;

    case 'STOP_CAPTURE':
      handleStopCapture(sender.tab?.id);
      break;

    case 'GENERATE_SUMMARY':
      handleGenerateSummary(message.payload);
      break;

    case 'SEND_EMAIL':
      handleSendEmail(message.payload, sendResponse);
      return true; // Keep message channel open for async response

    default:
      console.warn('[MeetAssist] Unknown message type:', message.type);
  }

  return false;
});

// Handle caption chunks from content script
function handleCaptionChunk(captionChunk: CaptionChunk) {
  console.log('[MeetAssist] Received caption chunk:', captionChunk);

  // Add to buffer
  const { transcriptId } = captionChunk;
  if (!captionBuffers.has(transcriptId)) {
    captionBuffers.set(transcriptId, []);
  }

  const buffer = captionBuffers.get(transcriptId)!;
  buffer.push(captionChunk);

  // Forward to side panel for real-time display
  sendMessageToSidePanel({
    type: 'CAPTION_CHUNK_RECEIVED',
    payload: captionChunk,
  });

  // Trigger AI processing if buffer is large enough
  if (buffer.length >= 5) { // Process every 5 captions
    triggerAIProcessing(transcriptId, buffer);
  }
}

// Handle caption stream stopped
function handleCaptionStreamStopped(payload: { sessionId: string }) {
  console.log('[MeetAssist] Caption stream stopped');

  // Process any remaining captions in buffer
  const buffer = captionBuffers.get(payload.sessionId);
  if (buffer && buffer.length > 0) {
    triggerAIProcessing(payload.sessionId, buffer);
  }

  // Clean up buffer
  captionBuffers.delete(payload.sessionId);

  // Notify side panel
  sendMessageToSidePanel({
    type: 'CAPTION_STREAM_STOPPED',
    payload,
  });
}

// Handle start capture command from side panel
function handleStartCapture(payload: { sessionId: string }, tabId?: number) {
  console.log('[MeetAssist] Starting capture for session:', payload.sessionId, 'tab:', tabId);

  if (tabId) {
    // Send command to content script
    chrome.tabs.sendMessage(tabId, {
      type: 'START_CAPTURE',
      payload,
    }).catch((error) => {
      console.error('[MeetAssist] Error sending start capture command:', error);
      sendMessageToSidePanel({
        type: 'CAPTION_ERROR',
        payload: { error: 'Failed to start capture. Make sure you are on a Google Meet page.' },
      });
    });
  }
}

// Handle stop capture command from side panel
function handleStopCapture(tabId?: number) {
  console.log('[MeetAssist] Stopping capture for tab:', tabId);

  if (tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: 'STOP_CAPTURE',
    }).catch((error) => {
      console.error('[MeetAssist] Error sending stop capture command:', error);
    });
  }
}

// Handle generate summary command from side panel (manual on-demand summary)
async function handleGenerateSummary(payload: {
  sessionId: string;
  captions: CaptionChunk[];
  previousSummary?: string;
}) {
  console.log('[MeetAssist] Generating summary for session:', payload.sessionId);

  // Get settings from storage
  chrome.storage.local.get(['context', 'aiProvider', 'apiKey'], async (result) => {
    const { context = 'technical', aiProvider = 'glm', apiKey } = result;

    if (!apiKey) {
      sendMessageToSidePanel({
        type: 'CAPTION_ERROR',
        payload: { error: 'API key not configured. Please add your API key in settings.' },
      });
      return;
    }

    // Process captions with AI (including previous summary for cumulative updates)
    const aiResult = await handleAIProcessing({
      captions: payload.captions,
      context,
      aiProvider,
      apiKey,
      previousSummary: payload.previousSummary,
    });

    if (aiResult.success) {
      // Send updates to side panel
      sendMessageToSidePanel({
        type: 'CUMULATIVE_SUMMARY_UPDATE',
        payload: aiResult.summary,
      });

      if (aiResult.suggestions && aiResult.suggestions.length > 0) {
        sendMessageToSidePanel({
          type: 'SUGGESTION_UPDATE',
          payload: aiResult.suggestions,
        });
      }

      if (aiResult.actionItems && aiResult.actionItems.length > 0) {
        sendMessageToSidePanel({
          type: 'ACTION_ITEMS_UPDATE',
          payload: aiResult.actionItems,
        });
      }
    } else {
      sendMessageToSidePanel({
        type: 'CAPTION_ERROR',
        payload: { error: aiResult.error || 'AI processing failed' },
      });
    }
  });
}

// Handle send email command from side panel
async function handleSendEmail(payload: any, sendResponse: (response?: any) => void) {
  console.log('[MeetAssist] Sending email with payload:', payload);

  try {
    // TODO: Implement email sending via Firebase Cloud Functions
    // For now, just acknowledge receipt
    sendResponse({ success: true, message: 'Email queued for sending' });
  } catch (error) {
    console.error('[MeetAssist] Error sending email:', error);
    sendResponse({ success: false, error: 'Failed to send email' });
  }
}

// Trigger AI processing for caption batch
function triggerAIProcessing(sessionId: string, captions: CaptionChunk[]) {
  console.log('[MeetAssist] Triggering AI processing for', captions.length, 'captions');

  // Get settings from storage
  chrome.storage.local.get(['context', 'aiProvider', 'apiKey'], async (result) => {
    const { context = 'technical', aiProvider = 'glm', apiKey } = result;

    if (!apiKey) {
      sendMessageToSidePanel({
        type: 'CAPTION_ERROR',
        payload: { error: 'API key not configured. Please add your API key in settings.' },
      });
      return;
    }

    // Process captions with AI
    const aiResult = await handleAIProcessing({
      captions,
      context,
      aiProvider,
      apiKey,
    });

    if (aiResult.success) {
      // Send updates to side panel
      sendMessageToSidePanel({
        type: 'SUMMARY_UPDATE',
        payload: aiResult.summary,
      });

      if (aiResult.suggestions && aiResult.suggestions.length > 0) {
        sendMessageToSidePanel({
          type: 'SUGGESTION_UPDATE',
          payload: aiResult.suggestions,
        });
      }
    } else {
      sendMessageToSidePanel({
        type: 'CAPTION_ERROR',
        payload: { error: aiResult.error || 'AI processing failed' },
      });
    }
  });
}

// Send message to side panel
function sendMessageToSidePanel(message: ExtensionMessage) {
  chrome.runtime.sendMessage(message).catch((error) => {
    // Side panel might not be open, which is fine
    console.debug('[MeetAssist] Could not send message to side panel:', error);
  });
}

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[MeetAssist] Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    // Initialize default settings
    chrome.storage.local.set({
      context: 'technical',
      aiProvider: 'glm',
      apiKey: '',
    });
  }
});

