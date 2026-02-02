import { FileText, CheckSquare, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigatorProps {
  activeTab: 'summary' | 'actions' | 'suggestions';
  onTabChange: (tab: 'summary' | 'actions' | 'suggestions') => void;
}

export default function TabNavigator({ activeTab, onTabChange }: TabNavigatorProps) {
  const tabs = [
    { id: 'summary' as const, label: 'Summary', icon: FileText },
    { id: 'actions' as const, label: 'Actions', icon: CheckSquare },
    { id: 'suggestions' as const, label: 'Suggestions', icon: Lightbulb },
  ];

  return (
    <div className="flex border-b border-border bg-background">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors',
              isActive
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-3 h-3" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

