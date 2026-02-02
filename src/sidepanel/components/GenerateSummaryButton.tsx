import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GenerateSummaryButtonProps {
  isCapturing: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  disabled?: boolean;
}

export default function GenerateSummaryButton({
  isCapturing,
  isGenerating,
  onGenerate,
  disabled = false,
}: GenerateSummaryButtonProps) {
  return (
    <Button
      onClick={onGenerate}
      disabled={disabled || isGenerating}
      className={cn(
        'w-full gap-2',
        !isCapturing && 'opacity-50',
        isGenerating && 'animate-pulse'
      )}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>Tạo Tóm Tắt</span>
        </>
      )}
    </Button>
  );
}

