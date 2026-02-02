import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: {
        manifest_version: 3,
        name: 'MeetAssist',
        version: '0.0.1',
        description: 'AI-powered Google Meet assistant with real-time captions capture and intelligent summaries',
        permissions: [
          'sidePanel',
          'activeTab',
          'scripting',
          'storage',
          'identity'
        ],
        host_permissions: [
          'https://meet.google.com/*'
        ],
        action: {
          default_title: 'Open MeetAssist Side Panel'
        },
        side_panel: {
          default_path: 'sidepanel.html'
        },
        background: {
          service_worker: 'src/background/index.ts',
          type: 'module'
        },
        content_scripts: [
          {
            matches: ['https://meet.google.com/*'],
            js: ['src/content/index.ts'],
            run_at: 'document_idle'
          }
        ],
        icons: {
          '16': 'icons/icon16.png',
          '48': 'icons/icon48.png',
          '128': 'icons/icon128.png'
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5174,
    },
  },
});

