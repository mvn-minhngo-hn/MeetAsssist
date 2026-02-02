# MeetAssist Chrome Extension

MeetAssist is a Chrome Extension (Manifest V3) that captures Google Meet captions, provides context-aware AI summaries (Technical/Business/General), suggests solutions, and auto-emails results.

## 🎯 Features

- 🎙️ **Real-time Caption Capture**: Automatically captures Google Meet captions
- 🤖 **AI-Powered Summaries**: Context-aware summaries in Vietnamese
- 💡 **Smart Suggestions**: AI-suggested solutions for technical and business challenges
- ✅ **Action Items**: Automatic generation of action items
- 📧 **Multi-Channel Notifications**: Send meeting notes to Email, Slack, Teams, Discord
- ☁️ **Cloud Sync**: Access meeting history across devices
- 🏷️ **Meeting Categories**: Organize meetings with tags

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Radix UI (Shadcn components)
- **State Management**: Zustand
- **AI Providers**: GLM-4 (primary), OpenAI GPT-4o-mini, Google Gemini
- **Backend**: Firebase Cloud Functions
- **Build Tool**: CRXJS Vite Plugin

## 📦 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Chrome (for testing)
- GLM-4 API key (or OpenAI/Gemini as fallback)
- GitHub account (optional, for cloud sync)

### Installation

```bash
# Clone repository
git clone git@github.com:mvn-minhngo-hn/MeetAssist.git
cd MeetAssist

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
6. Click extension icon to open side panel

### Project Structure

```
MeetAssist/
├── public/            # Extension manifest and assets
│   ├── manifest.json        # Chrome extension manifest
│   └── icons/            # Extension icons (16x16, 48x48, 128x128)
├── src/              # Source code
│   ├── background/   # Service worker
│   ├── content/      # Content script (caption scraper)
│   ├── sidepanel/    # Side panel UI
│   ├── lib/          # Utilities and helpers
│   ├── store/        # Zustand state management
│   └── types/        # TypeScript types
├── functions/         # Firebase Cloud Functions
└── tests/             # Unit and E2E tests (TODO)
```

## 📱 Usage

### 1. Install and Load Extension

Follow the installation steps above to load the extension.

### 2. Open Google Meet

Join or start a Google Meet call with captions enabled.

### 3. Open Side Panel

Click the MeetAssist extension icon to open the side panel.

### 4. Configure AI Provider

Add your AI provider API key in settings:
- **GLM-4** (Recommended): Best for Vietnamese language support
- **OpenAI GPT-4o-mini**: Fast and cost-effective fallback
- **Google Gemini Flash**: Quick alternative

### 5. Select Meeting Context

