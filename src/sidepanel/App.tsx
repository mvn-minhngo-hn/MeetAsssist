import { useEffect, useState } from 'react';
import { useExtensionStore } from '@/store/useExtensionStore';
import CompactHeader from './components/CompactHeader';
import TabNavigator from './components/TabNavigator';
import SummaryTab from './components/SummaryTab';
import ActionItemsTab from './components/ActionItemsTab';
import SuggestionsTab from './components/SuggestionsTab';
import BottomActionBar from './components/BottomActionBar';
import HistoryDashboard from './pages/HistoryDashboard';
import MeetingDetail from './components/MeetingDetail';

type TabType = 'summary' | 'actions' | 'suggestions';
type AppMode = 'capture' | 'history' | 'detail';

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
    meetings,
    categories,
  } = useExtensionStore();

  const [mode, setMode] = useState<AppMode>('capture');
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

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

  // Handle meeting selection from history
  const handleViewMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setMode('detail');
  };

  const handleBackFromDetail = () => {
    setSelectedMeeting(null);
    setMode('history');
  };

  return (
    <div className="h-screen w-[320px] flex flex-col bg-background">
      {/* Top Bar - Sticky Header */}
      <CompactHeader
        isCapturing={isCapturing}
        context={context}
        aiProvider={aiProvider}
        onToggleCapture={handleToggleCapture}
        mode={mode}
        onModeChange={setMode}
      />

      {/* Main Content */}
      {mode === 'detail' && selectedMeeting ? (
        <MeetingDetail
          meeting={selectedMeeting}
          onBack={handleBackFromDetail}
        />
      ) : mode === 'capture' ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
