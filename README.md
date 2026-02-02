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

Choose the appropriate context:
- **Technical**: For technical discussions, code reviews, architecture decisions
- **Business**: For customer meetings, sales discussions, KPIs
- **General**: For general meetings without specific focus

### 6. Start Capturing Captions

Click "Start" to begin capturing Google Meet captions.

### 7. View Real-time Summaries

Watch AI-powered summaries appear in real-time.

### 8. Manage Action Items

- Add new action items manually
- Check off completed items
- Copy action items to clipboard

### 9. View AI Suggestions

- AI suggests solutions for technical blockers or business challenges
- Click to copy suggestions

### 10. Send Meeting Notes

Click "End & Send Notes" to:
- Stop capturing
- Compile final meeting summary
- Share to multiple channels (Email, Slack, Teams, Discord)

## 🔧 Development Workflow

### Code Quality

The project uses ESLint, Prettier, and Husky for code quality:

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Build project
npm run build
```

### Pre-commit Hooks

Husky automatically runs linting and formatting before each commit.

### Git Workflow

```bash
# Start development
npm run dev

# Make changes
git add .
git commit -m "type: description"

# Push to GitHub
git push origin main
```

### Branch Strategy

Use feature branches for new development:

```bash
# Create feature branch
git checkout -b feature/add-new-component

# Make changes
git add .
git commit -m "feat: add new component"

# Push branch
git push -u origin feature/add-new-component

# Create Pull Request on GitHub
```

## 📦 Development Setup

### Environment Variables

Create `.env` file for sensitive configuration:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email@firebaseapp.com

# API Keys (DO NOT COMMIT THESE!)
GLM_API_KEY=your-glm-api-key
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# Notification Channels
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
EMAIL_RECIPIENT=email@example.com
```

⚠️ **Important**: Never commit `.env` files or API keys to version control!

## 🧪 Testing

### Manual Testing

Test the following scenarios:

- [ ] Caption capture works in different Google Meet layouts
- [ ] AI summaries appear correctly for all contexts
- [ ] Action items are generated and displayed
- [ ] Suggestions are relevant and helpful
- [ ] Multi-channel notifications work (Email, Slack, Teams, Discord)
- [ ] Meeting history is saved and retrieved correctly
- [ ] Categories can be created and assigned
- [ ] Search and filters work correctly

### Unit Tests (TODO)

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

### E2E Testing

```bash
# Run E2E tests
npm run test:e2e
```

## 📊 Data Models

### CaptionChunk
```typescript
interface CaptionChunk {
  speaker: string;
  text: string;
  timestamp: number;
  transcriptId: string;
}
```

### Meeting
```typescript
interface Meeting {
  id: string;
  userId: string;
  title: string;
  date: Date;
  duration: number; // seconds
  context: 'technical' | 'business' | 'general';
  categories: string[];
  summary: string;
  actionItems: {
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
  }[];
  suggestions: string[];
  transcript: string; // Full transcript
  participantCount: number;
  aiProvider: 'glm' | 'openai' | 'gemini';
  aiModel: string;
  tokenUsage: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  meetingCount: number;
  createdAt: Date;
}
```

## 🔐 Security & Privacy

- ✅ **Local Storage**: Captions and meeting data stored in `chrome.storage.local`
- 🔒 **No Telemetry**: No data sent without explicit consent
- 🔐 **API Keys**: API keys encrypted and stored locally
- ✅ **User Control**: Option to delete all data anytime
- 🔐 **Firebase Security**: Server-side validation and proper authentication
- 📜 **GDPR Compliance**: Right to export/delete personal data

### Privacy Features

1. **Caption Captions**: Only stored locally, never sent externally except AI processing
2. **Meeting Data**: User-controlled cloud sync with Firebase
3. **API Keys**: Never exposed, stored in browser extension storage
4. **No Persistent Tracking**: No analytics or user tracking
5. **Transparent Data Handling**: Clear explanation of what data is sent where

### Data Deletion

Users can delete:
- Individual meetings
- All meeting history
- Account data and preferences
- All locally cached data

## 📝 License

MIT License - free for use, modification, and distribution

## 🗺️ Roadmap

### Current Status

- [x] Phase 1: Foundation & Core Communication ✓
- [x] Phase 2: Context-Aware UI & Logic ✓
- [x] Phase 3: AI Integration & Solution Suggestions ✓
- [x] Phase 4: Multi-Channel Notification & Backend ✓
- [x] Phase 5: Google Meet Optimized UI/UX Design ✓
- [x] Phase 6: Meeting History Management & Cloud Sync ✓

### Upcoming Features (TODO)

- [ ] Advanced search (full-text with operators)
- [ ] Meeting analytics dashboard
- [ ] Calendar integration
- [ ] Calendar export (ICS, Google Calendar)
- [ ] Meeting templates
- [ ] Reminder system for action items
- [ ] Meeting recording (audio/video)
- [ ] Offline mode support
- [ ] Multi-language summaries
- [ ] Voice commands
- [ ] Team collaboration features
- [ ] Integration with Google Calendar events
- [ ] Time tracking integration
- [ ] Project management integration

### Known Issues

- ⚠️ Google Meet DOM changes may break caption detection (requires monitoring and updates)
- ⚠️ AI API rate limits may affect real-time summaries
- ⚠️ Firebase free tier has limits on concurrent connections
- ⚠️ Large meetings with long transcripts may hit token limits

## 🤝 Contributing

Contributions are welcome! Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

### Code Style Guidelines

- Use `cn()` utility for conditional classes
- Follow Prettier formatting
- Run linting before committing
- Write descriptive commit messages

### Commit Message Format

- `feat:` New features
- `fix:` Bug fixes
- `style:` Code style changes (formatting, linting)
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `chore:` Maintenance tasks (dependencies, build configuration)

## 📞 Troubleshooting

### Extension Not Loading

1. Make sure Developer Mode is enabled in Chrome Extensions
2. Check if the `dist` folder is correctly selected
3. Check Chrome console for errors
4. Refresh the page and reload extension

### Captions Not Working

1. Verify Google Meet captions are enabled
2. Check if you're on `https://meet.google.com/*`
3. Reload the extension
4. Check Chrome console for caption errors

### AI Summaries Not Appearing

1. Verify your API key is configured in settings
2. Check your network connection
3. Try different AI provider (GLM-4, OpenAI, Gemini)
4. Check Chrome console for API errors
5. Verify your context selection matches meeting type

### Notifications Not Sending

1. Verify webhook URLs are correct
2. Check Firebase Cloud Functions are deployed
3. Test individual channel separately
4. Check payload structure matches backend expectations
5. Check authentication settings

### Build Errors

```bash
# Clear cache
rm -rf node_modules .vite
rm -rf dist

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### TypeScript Errors

If you see TypeScript errors:

```bash
# Update types
npm install @types/node @types/react

# Check tsconfig.json
npm run type-check
```

### CSS/Tailwind Issues

If styles are not applied:

```bash
# Rebuild with Tailwind
npm run build
```

## 📞 Support

For issues, questions, or suggestions:

1. 📖 Check existing [Issues](https://github.com/mvn-minhngo-hn/MeetAssist/issues)
2. 📖 Create a new [Issue](https://github.com/mvn-minhngo-hn/MeetAssist/issues/new)
3. 📧 Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

### Debugging

Enable debugging in Chrome:

1. Open side panel
2. Click "Start" to begin capturing
3. Open Chrome DevTools Console (F12)
4. Look for `[SidePanel]`, `[MeetAssist]` log messages
5. Check Network tab for API requests

## 🎉 Credits

Built with ❤️ by Minh Ngo

**Special thanks to:**
- Open source community
- Chrome extension development tools
- AI technology providers
