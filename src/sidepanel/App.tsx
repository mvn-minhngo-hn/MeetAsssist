import { useEffect, useState } from 'react';
import { useExtensionStore } from '@/store/useExtensionStore';
import CompactHeader from './components/CompactHeader';
import TabNavigator from './components/TabNavigator';
import SummaryTab from './components/SummaryTab';
import ActionItemsTab from './components/ActionItemsTab';
import SuggestionsTab from './components/SuggestionsTab';
import BottomActionBar from './components/BottomActionBar';

type TabType = 'summary' | 'actions' | 'suggestions';

export default function App() {
  const {
    isCapturing,
    context,
    aiProvider,
    transcript,
    currentSummary,
    actionItems,
    suggestions,
    startCapture,
    stopCapture,
  } = useExtensionStore();

  const [activeTab, setActiveTab] = useState<TabType>('summary');
  // Listen for messages from background script
  useEffect(() => {
    const messageListener = (message: any) => {
      console.log('[SidePanel] Received message:', message.type);

      switch (message.type) {
        case 'SUMMARY_UPDATE':
          useExtensionStore.getState().updateSummary(message.payload);
          break;
        case 'SUGGESTION_UPDATE':
          useExtensionStore.getState().setSuggestions(message.payload);
          break;
        case 'CAPTION_ERROR':
          console.error('[SidePanel] Caption error:', message.payload.error);
          // TODO: Show error toast notification
          break;
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // Handle start/stop capture
  const handleToggleCapture = () => {
    if (isCapturing) {
      stopCapture();
    } else {
      startCapture();
      // Send message to background to start capture in content script
      chrome.runtime.sendMessage({
        type: 'START_CAPTURE',
        payload: { sessionId: crypto.randomUUID() },
      });
    }
  };

  return (
    <div className="h-screen w-[320px] flex flex-col bg-background">
      {/* Top Bar - Sticky Header */}
      <CompactHeader
        isCapturing={isCapturing}
        context={context}
        aiProvider={aiProvider}
        onToggleCapture={handleToggleCapture}
      />

      {/* Tab Navigator */}
      <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'summary' && (
          <SummaryTab
            summary={currentSummary}
            transcriptLength={transcript.length}
            isCapturing={isCapturing}
          />
        )}
        {activeTab === 'actions' && (
          <ActionItemsTab items={actionItems} />
        )}
        {activeTab === 'suggestions' && (
          <SuggestionsTab suggestions={suggestions} />
        )}
      </div>

      {/* Bottom Bar - Action Buttons */}
      <BottomActionBar isCapturing={isCapturing} />
    </div>
  );
}

