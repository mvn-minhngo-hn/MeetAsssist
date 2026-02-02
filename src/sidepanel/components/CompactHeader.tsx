import { Mic, MicOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContextSelector from './ContextSelector';
import AIProviderSelector from './AIProviderSelector';
import LoginButton from './LoginButton';

interface CompactHeaderProps {
  isCapturing: boolean;
  context: 'technical' | 'business' | 'general';
  aiProvider: 'glm' | 'openai' | 'gemini';
  onToggleCapture: () => void;
  mode?: 'capture' | 'history';
  onModeChange?: (mode: 'capture' | 'history') => void;
}

export default function CompactHeader({
  isCapturing,
  context,
  aiProvider,
  onToggleCapture,
  mode,
  onModeChange,
}: CompactHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border h-[50px] flex items-center justify-between px-3 shadow-sm">
      {/* Left: Context Selector */}
      <ContextSelector context={context} />

      {/* Center: AI Provider Badge */}
      <AIProviderSelector provider={aiProvider} />

      {/* Right: User & Controls - Hide in history mode */}
      {mode === 'capture' && (
        <div className="flex items-center gap-2">
          <LoginButton />
          <Button
            onClick={onToggleCapture}
            variant={isCapturing ? 'destructive' : 'default'}
            size="sm"
            className="gap-1"
          >
            {isCapturing ? (
              <>
                <MicOff className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Start
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

