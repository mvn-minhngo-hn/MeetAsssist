import { Clock, Users, FileText } from 'lucide-react';

interface SummaryTabProps {
  summary: string;
  transcriptLength: number;
  isCapturing: boolean;
}

export default function SummaryTab({ summary, transcriptLength, isCapturing }: SummaryTabProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Summary Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="w-4 h-4 text-primary" />
          Meeting Summary
        </div>
        {summary ? (
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            {isCapturing
              ? 'Listening to captions... Summary will appear here.'
              : 'Start capturing captions to see AI-powered summary.'}
          </div>
        )}
      </div>

      {/* Meeting Stats */}
      {(transcriptLength > 0 || isCapturing) && (
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground">Meeting Stats</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>Captions: {transcriptLength}</span>
            </div>
            {isCapturing && (
              <div className="flex items-center gap-2 text-xs text-success">
                <Clock className="w-3 h-3 animate-pulse" />
                <span>Recording...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!summary && !isCapturing && transcriptLength === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <div className="text-sm font-medium text-muted-foreground mb-1">
            No Summary Yet
          </div>
          <div className="text-xs text-muted-foreground">
            Click "Start" to begin capturing captions
          </div>
        </div>
      )}
    </div>
  );
}

