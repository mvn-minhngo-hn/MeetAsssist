# MeetAssist Chrome Extension

MeetAssist is a Chrome Extension (Manifest V3) that captures Google Meet captions, provides context-aware AI summaries (Technical/Business/General), suggests solutions, and auto-emails results.

## Features

- 🎙️ **Real-time Caption Capture**: Automatically captures Google Meet captions
- 🤖 **AI-Powered Summaries**: Context-aware summaries in Vietnamese
- 💡 **Smart Suggestions**: AI-suggested solutions for technical and business challenges
- ✅ **Action Items**: Automatic generation of action items
- 📧 **Multi-Channel Notifications**: Send meeting notes to Email, Slack, Teams, Discord
- ☁️ **Cloud Sync**: Access meeting history across devices
- 🏷️ **Meeting Categories**: Organize meetings with tags

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Radix UI (Shadcn components)
- **State Management**: Zustand
- **AI Providers**: GLM-4 (primary), OpenAI GPT-4o-mini, Google Gemini
- **Backend**: Firebase Cloud Functions
- **Database**: Firebase Firestore
- **Build Tool**: CRXJS Vite Plugin

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Chrome (for testing)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Loading the Extension

1. Run `npm run dev` or `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist` folder

### Project Structure

```
MeetAssist/
├── public/
│   └── manifest.json        # Chrome extension manifest
├── src/
│   ├── background/          # Background service worker
│   ├── content/             # Content script (caption scraper)
│   ├── sidepanel/          # Side panel UI
│   ├── lib/                # Utilities and helpers
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript types
└── functions/              # Firebase Cloud Functions
```

## Usage

1. **Install and Load**: Follow installation steps above
2. **Open Google Meet**: Join or start a Google Meet call
3. **Open Side Panel**: Click the extension icon to open the side panel
4. **Configure AI Provider**: Add your GLM-4 API key in settings (or OpenAI/Gemini as fallback)
5. **Select Context**: Choose Technical, Business, or General context
6. **Start Capturing**: Click "Start" to begin capturing captions
7. **View Real-time Summaries**: Watch AI summaries, action items, and suggestions
8. **Send Notes**: Click "End & Send Notes" to share via Email, Slack, Teams, or Discord

## AI Providers

MeetAssist supports multiple AI providers:

1. **GLM-4** (Default): Excellent Vietnamese support, cost-effective
2. **OpenAI GPT-4o-mini**: Reliable fallback option
3. **Google Gemini Flash**: Fast alternative

Each provider requires its own API key, which can be configured in the extension settings.

## Privacy & Security

- Captions are stored locally in `chrome.storage.local`
- Transcripts are only sent to selected AI provider for processing
- Meeting data is encrypted in Firebase Firestore
- Option to delete all data anytime

## License

MIT

