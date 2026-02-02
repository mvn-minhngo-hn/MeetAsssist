import type { CaptionChunk, ExtensionMessage } from '@/types';

// Caption scraper for Google Meet
class CaptionScraper {
  private observer: MutationObserver | null = null;
  private isRunning = false;
  private sessionId: string = '';

  constructor() {
    this.init();
  }

  private init() {
    console.log('[MeetAssist] Content script initialized');

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
      if (message.type === 'START_CAPTURE') {
        this.startCapture(message.payload?.sessionId);
      } else if (message.type === 'STOP_CAPTURE') {
        this.stopCapture();
      }
    });
  }

  private startCapture(sessionId: string) {
    console.log('[MeetAssist] Starting caption capture');
    this.sessionId = sessionId;
    this.isRunning = true;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.observeCaptions());
    } else {
      this.observeCaptions();
    }
  }

  private stopCapture() {
    console.log('[MeetAssist] Stopping caption capture');
    this.isRunning = false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Notify background that stream stopped
    this.sendMessage({
      type: 'CAPTION_STREAM_STOPPED',
      payload: { sessionId: this.sessionId },
    });
  }

  private observeCaptions() {
    // Strategy 1: Target Google Meet caption container
    // Google Meet uses dynamic classes, so we target specific ARIA attributes and DOM structure

    // Try multiple selector strategies
    const selectors = [
      // Strategy 1: Div with aria-live and role="region" (most common)
      'div[role="region"][aria-live="polite"]',
      // Strategy 2: Div with jsname attribute containing caption-related values
      'div[jsname*="caption"]',
      // Strategy 3: Div containing captions inside the caption panel
      'div[jsname="a7acab"] div[jsname="W7rFeb"]',
      // Strategy 4: Fallback - look for any div with text that might be a caption
      'div[jsname="W7rFeb"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log('[MeetAssist] Found caption element with selector:', selector);
        this.attachObserver(element);
        return;
      }
    }

    // Fallback: Try to find and observe the entire caption panel
    const captionPanel = document.querySelector('[jsname="a7acab"]');
    if (captionPanel) {
      console.log('[MeetAssist] Found caption panel, observing for changes');
      this.attachObserver(captionPanel);
    } else {
      console.warn('[MeetAssist] Could not find caption elements. Retrying in 2 seconds...');
      // Retry after 2 seconds
      setTimeout(() => this.observeCaptions(), 2000);
    }
  }

  private attachObserver(target: Element) {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          this.processMutation(mutation);
        }
      }
    });

    this.observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Initial scan for existing content
    this.scanForCaptions(target);
  }

  private processMutation(mutation: MutationRecord) {
    if (!this.isRunning) return;

    // Look for text changes
    if (mutation.type === 'characterData' && mutation.target instanceof Text) {
      const text = mutation.target.textContent?.trim();
      if (text && text.length > 0) {
        this.extractAndSendCaption(mutation.target.parentElement);
      }
    } else if (mutation.type === 'childList') {
      // Check added nodes
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          this.scanForCaptions(node);
        }
      }
    }
  }

  private scanForCaptions(root: Element) {
    if (!this.isRunning) return;

    // Look for caption text elements
    // Google Meet captions typically have specific structure
    const captionElements = root.querySelectorAll('[jsname="W7rFeb"], [role="region"][aria-live="polite"]');

    captionElements.forEach((element) => {
      this.extractAndSendCaption(element);
    });
  }

  private extractAndSendCaption(element: Element | null) {
    if (!element || !this.isRunning) return;

    try {
      // Extract text content
      const text = element.textContent?.trim();
      if (!text || text.length === 0) return;

      // Try to extract speaker name
      // In Google Meet, the speaker name is usually in a sibling or parent element
      const speaker = this.extractSpeaker(element);

      // Create caption chunk
      const captionChunk: CaptionChunk = {
        speaker,
        text,
        timestamp: Date.now(),
        transcriptId: this.sessionId,
      };

      // Send to background script
      this.sendMessage({
        type: 'CAPTION_CHUNK_RECEIVED',
        payload: captionChunk,
      });

      console.log('[MeetAssist] Caption captured:', { speaker, text });
    } catch (error) {
      console.error('[MeetAssist] Error extracting caption:', error);
      this.sendMessage({
        type: 'CAPTION_ERROR',
        payload: { error: 'Failed to extract caption' },
      });
    }
  }

  private extractSpeaker(element: Element): string {
    // Try multiple strategies to find speaker name
    const speakerSelectors = [
      // Look for a parent element with speaker info
      'div[jsname="wAN2Le"]',
      'div[jsname="qgcq3d"]',
      '[data-name="speaker"]',
    ];

    for (const selector of speakerSelectors) {
      const speakerElement = element.closest(selector);
      if (speakerElement) {
        const speakerText = speakerElement.textContent?.trim();
        if (speakerText && speakerText.length > 0 && speakerText.length < 50) {
          return speakerText;
        }
      }
    }

    // Fallback: Look for any nearby text that might be a name
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      for (const sibling of siblings) {
        if (sibling !== element && sibling.textContent) {
          const text = sibling.textContent.trim();
          // Speaker names are typically short (2-30 chars)
          if (text.length > 2 && text.length < 30 && !text.includes(' ')) {
            return text;
          }
        }
      }
    }

    // Default to unknown speaker
    return 'Unknown';
  }

  private sendMessage(message: ExtensionMessage) {
    try {
      chrome.runtime.sendMessage(message);
    } catch (error) {
      console.error('[MeetAssist] Error sending message:', error);
    }
  }
}

// Initialize the scraper when content script loads
new CaptionScraper();

