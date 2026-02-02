import { useState } from 'react';
import { X, Save, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useExtensionStore } from '@/store/useExtensionStore';
import type { AIProvider } from '@/types';
import { getChannelConfig } from '@/lib/notifications/channelConfig';
import { cn } from '@/lib/utils';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    apiKey,
    setApiKey,
    aiProvider,
    setAiProvider,
  } = useExtensionStore();

  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [localProvider, setLocalProvider] = useState<AIProvider>(aiProvider);
  const [notificationConfig, setNotificationConfig] = useState({
    email: '',
    slackWebhook: '',
    teamsWebhook: '',
    discordWebhook: '',
  });

  const handleSave = () => {
    setApiKey(localApiKey);
    setAiProvider(localProvider);
    
    // Save notification configs
    chrome.storage.local.set({
      notificationConfig,
    });
    
    onClose();
  };

  const providers = [
    { id: 'glm' as const, label: 'GLM-4 (Recommended)', description: 'Tốt cho tiếng Việt' },
    { id: 'openai' as const, label: 'OpenAI GPT-4o-mini', description: 'Nhanh, chi phí thấp' },
    { id: 'gemini' as const, label: 'Google Gemini Flash', description: 'Từ Google' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cấu Hình</DialogTitle>
          <DialogDescription>
            Thiết lập AI provider và các kênh thông báo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* AI Provider Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">AI Provider</label>
            <div className="space-y-2">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setLocalProvider(provider.id)}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${localProvider === provider.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-background'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="aiProvider"
                    value={provider.id}
                    checked={localProvider === provider.id}
                    onChange={() => setLocalProvider(provider.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{provider.label}</div>
                    <div className="text-xs text-muted-foreground">{provider.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              API Key {`(${localProvider.toUpperCase()})`}
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Nhập API key của bạn..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              API key sẽ được lưu trh c chrome.storage.local
            </p>
          </div>

          {/* Email Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email nhận thông báo</label>
            <input
              type="email"
              value={notificationConfig.email}
              onChange={(e) => setNotificationConfig(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Slack Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slack Webhook URL</label>
            <input
              type="url"
              value={notificationConfig.slackWebhook}
              onChange={(e) => setNotificationConfig(prev => ({ ...prev, slackWebhook: e.target.value }))}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Teams Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Teams Webhook URL</label>
            <input
              type="url"
              value={notificationConfig.teamsWebhook}
              onChange={(e) => setNotificationConfig(prev => ({ ...prev, teamsWebhook: e.target.value }))}
              placeholder="https://outlook.office.com/webhook/..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Discord Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Discord Webhook URL</label>
            <input
              type="url"
              value={notificationConfig.discordWebhook}
              onChange={(e) => setNotificationConfig(prev => ({ ...prev, discordWebhook: e.target.value }))}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Lưu Thiết Lập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

