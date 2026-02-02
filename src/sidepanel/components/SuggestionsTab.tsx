import { Lightbulb, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuggestionsTabProps {
  suggestions: string[];
}

export default function SuggestionsTab({ suggestions }: SuggestionsTabProps) {
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Lightbulb className="w-4 h-4 text-warning" />
        AI Suggestions
      </div>

      {/* Suggestions List */}
      {suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Lightbulb className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <div className="text-sm font-medium text-muted-foreground mb-1">
            No Suggestions Yet
          </div>
          <div className="text-xs text-muted-foreground">
            AI will suggest solutions as it analyzes the meeting
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="relative p-3 rounded-md bg-warning/5 border border-warning/20"
            >
              {/* Icon Badge */}
              <div className="absolute top-2 left-2">
                <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-warning" />
                </div>
              </div>

              {/* Content */}
              <div className="pl-7 pr-8">
                <p className="text-xs text-foreground leading-relaxed">
                  {suggestion}
                </p>
              </div>

              {/* Copy Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyToClipboard(suggestion)}
                className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-primary"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

