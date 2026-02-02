import { useEffect, useState } from 'react';
import { useExtensionStore } from '@/store/useExtensionStore';
import CompactHeader from './components/CompactHeader';
import TabNavigator from './components/TabNavigator';
import SummaryTab from './components/SummaryTab';
import ActionItemsTab from './components/ActionItemsTab';
import SuggestionsTab from './components/SuggestionsTab';
import GenerateSummaryButton from './components/GenerateSummaryButton';
import BottomActionBar from './components/BottomActionBar';
import HistoryDashboard from './pages/HistoryDashboard';
import MeetingDetail from './components/MeetingDetail';
import type { Meeting } from '@/types';

type TabType = 'summary' | 'actions' | 'suggestions';
type AppMode = 'capture' | 'history' | 'detail';

export default function App() {
  const {
    isCapturing,
    context,
    aiProvider,
    transcript,
    currentSummary,
    cumulativeSummary,
    actionItems,
    suggestions,
    startCapture,
    stopCapture,
    updateCumulativeSummary,
    setActionItems,
    setSuggestions,
    setIsGeneratingSummary,
    isGeneratingSummary,
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
        case 'CUMULATIVE_SUMMARY_UPDATE':
          useExtensionStore.getState().updateCumulativeSummary(message.payload);
          setIsGeneratingSummary(false);
          break;
        case 'SUGGESTION_UPDATE':
          useExtensionStore.getState().setSuggestions(message.payload);
          break;
        case 'ACTION_ITEMS_UPDATE':
          useExtensionStore.getState().setActionItems(message.payload);
          break;
        case 'CAPTION_ERROR':
          console.error('[SidePanel] Caption error:', message.payload.error);
          setIsGeneratingSummary(false);
          // TODO: Show error toast notification
          break;
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [setIsGeneratingSummary]);

  const handleToggleCapture = () => {
    if (isCapturing) {
      stopCapture();
    } else {
      startCapture();
    }
  };

  const handleGenerateSummary = async () => {
    if (!isCapturing || transcript.length === 0) {
      console.warn('[SidePanel] Cannot generate summary: not capturing or no transcript');
      return;
    }

    console.log('[SidePanel] Generating summary for', transcript.length, 'captions');

    setIsGeneratingSummary(true);

    // Get session ID and previous summary
    const sessionId = useExtensionStore.getState().sessionId || '';
    const previousSummary = cumulativeSummary || currentSummary || '';

    // Send message to background script
    try {
      await chrome.runtime.sendMessage({
        type: 'GENERATE_SUMMARY',
        payload: {
          sessionId,
          captions: transcript,
          previousSummary: previousSummary,
        },
      });
    } catch (error) {
      console.error('[SidePanel] Error generating summary:', error);
      setIsGeneratingSummary(false);
    }
  };

  const handleBackFromDetail = () => {
    setSelectedMeeting(null);
    setMode('history');
  };

  return (
    <div className="h-screen w-[320px] flex flex-col bg-background">
      <CompactHeader
        isCapturing={isCapturing}
        context={context}
        aiProvider={aiProvider}
        onToggleCapture={handleToggleCapture}
        mode={mode as 'capture' | 'history'}
        onModeChange={setMode}
      />

      {mode === 'detail' && selectedMeeting ? (
        <MeetingDetail meeting={selectedMeeting} onBack={handleBackFromDetail} />
      ) : mode === 'history' ? (
        <HistoryDashboard />
      ) : (
        <>
          <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'summary' && (
              <SummaryTab
                summary={cumulativeSummary || currentSummary}
                transcriptLength={transcript.length}
                isCapturing={isCapturing}
              />
            )}
            {activeTab === 'actions' && <ActionItemsTab items={actionItems} />}
            {activeTab === 'suggestions' && <SuggestionsTab suggestions={suggestions} />}
          </div>
          <BottomActionBar isCapturing={isCapturing}>
            {isCapturing && (
              <GenerateSummaryButton
                isCapturing={isCapturing}
                isGenerating={isGeneratingSummary}
                onGenerate={handleGenerateSummary}
                disabled={transcript.length === 0}
              />
            )}
          </BottomActionBar>
        </>
      )}
    </div>
  );
}
