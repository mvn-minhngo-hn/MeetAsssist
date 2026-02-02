import type { AIProvider } from '@/types';
import { cn } from '@/lib/utils';

const providerLabels: Record<AIProvider, string> = {
  glm: 'GLM-4',
  openai: 'GPT-4',
  gemini: 'Gemini',
};

const providerColors: Record<AIProvider, string> = {
  glm: 'bg-blue-500',
  openai: 'bg-green-500',
  gemini: 'bg-purple-500',
};

export default function AIProviderSelector({ provider }: { provider: AIProvider }) {
  const label = providerLabels[provider];
  const color = providerColors[provider];

  return (
    <div className={cn(
      'flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-medium',
      color
    )}>
      {label}
    </div>
  );
}

