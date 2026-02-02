# MeetAssist Chrome Extension

MeetAssist is a Chrome Extension (Manifest V3) that captures Google Meet captions, provides context-aware AI summaries (Technical/Business/General), suggests solutions, and auto-emails results.

## 🎯 Features

- 🎙️ **Real-time Caption Capture**: Automatically captures Google Meet captions
- 🤖 **AI-Powered Summaries**: Context-aware summaries in Vietnamese using GLM-4
- 💡 **Smart Suggestions**: AI-suggested solutions for technical and business challenges
- ✅ **Action Items**: Automatic generation of action items
- 📧 **Multi-Channel Notifications**: Send meeting notes to Email, Slack, Teams, Discord
- ☁️ **Cloud Sync**: Access meeting history across devices (optional)
- 🏷️ **Meeting Categories**: Organize meetings with tags

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Radix UI (Shadcn components)
- **State Management**: Zustand
- **AI Providers**: GLM-4 (primary), OpenAI GPT-4o-mini, Google Gemini
- **Backend**: Firebase Cloud Functions (optional)
- **Build Tool**: CRXJS Vite Plugin

## 🚀 Quick Start (5 phút để test)

### Step 1: Lấy GLM API Key (Miễn phí)

1. Truy cập **https://open.bigmodel.cn/**
2. Đăng ký tài khoản (email hoặc WeChat)
3. Đăng nhập → Vào **"API Keys"** → Click **"Create new API key"**
4. Copy API key

### Step 2: Build Extension

```bash
# Clone repository
git clone git@github.com:mvn-minhngo-hn/MeetAssist.git
cd MeetAssist

# Install dependencies
npm install

# Build extension
npm run build
```

### Step 3: Load vào Chrome

1. Mở **chrome://extensions/**
2. Enable **"Developer mode"** (toggle ở góc phải)
3. Click **"Load unpacked"**
4. Chọn thư mục `dist/`
5. Click icon extension để mở side panel

### Step 4: Configure GLM API Key

**Cách 1: Tạo file `.env` (Khuyến nghị)**

Tạo file `.env` trong thư mục gốc dự án với nội dung:

```env
VITE_GLM_API_KEY=your_actual_glm_api_key_here
```

Lưu ý: Thay `your_actual_glm_api_key_here` bằng API key thực của bạn từ **https://open.bigmodel.cn/**

**Cách 2: Nhập trực tiếp trong UI**

1. Mở side panel
2. Click icon **Settings** (⚙️)
3. Chọn **GLM** làm AI Provider
4. Dán API Key vào trường **API Key**
5. Click **Save**

### Step 5: Test AI Features

1. Truy cập **https://meet.google.com/**
2. Tạo cuộc họp (có thể test một mình)
3. Bật **captions** (CC icon) → Chọn "English"
4. Mở MeetAssist extension
5. Click **"Start Capture"** (🔴)
6. Nói chuyện vài câu
7. Wait ~3-5 giây → AI sẽ xử lý và hiển thị:
   - ✅ **Summary**: Tóm tắt tiếng Việt
   - ✅ **Actions**: Action items
   - ✅ **Suggestions**: Gợi ý solutions

> 📖 **Xem hướng dẫn chi tiết hơn trong [TESTING.md](TESTING.md)**

---

## 📦 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Chrome (for testing)
- GLM-4 API key (or OpenAI/Gemini as fallback)
- Firebase account (optional, for cloud sync)

### Installation

```bash
# Install dependencies
npm install

# Start development server (watch mode)
npm run dev

# Build for production
npm run build
```

### Project Structure

```
MeetAssist/
├── public/              # Extension manifest and assets
│   ├── manifest.json    # Chrome extension manifest
│   └── icons/          # Extension icons (16x16, 48x48, 128x128)
├── src/                # Source code
│   ├── background/     # Service worker & AI processing
│   ├── content/        # Content script (caption scraper)
│   ├── sidepanel/      # Side panel UI
│   │   ├── components/ # UI components
│   │   ├── pages/      # History pages
│   │   └── App.tsx     # Main app component
│   ├── lib/            # Utilities and helpers
│   ├── store/          # Zustand state management
│   └── types/          # TypeScript types
├── functions/          # Firebase Cloud Functions (optional)
├── TESTING.md          # Testing guide
└── ENV_EXAMPLE.md      # Environment variables template
```

---

## 📱 Usage

### Meeting Modes

Extension hỗ trợ 3 modes:

1. **Capture Mode**: Capturing captions, generating real-time summaries
2. **History Mode**: View past meetings, search, filter
3. **Detail Mode**: View detailed meeting transcript and AI outputs

### Context Types

Choose the right context for your meeting:

- **Technical**: Architecture discussions, bug reports, tech stack decisions
- **Business**: Customer meetings, budget discussions, contract negotiations
- **General**: Casual conversations, team updates, general discussions

---

## ⚙️ Configuration

### AI Provider Configuration

Extension supports 3 AI providers:

**GLM-4 (Recommended)**
- Best Vietnamese language support
- Fast response time
- Sign up: https://open.bigmodel.cn/

**OpenAI GPT-4o-mini**
- Alternative with good performance
- Sign up: https://platform.openai.com/

**Google Gemini Flash**
- Quick and cost-effective
- Sign up: https://aistudio.google.com/

### Firebase Configuration (Optional)

Firebase is **NOT required** for AI features! Only configure if you want:

- Meeting history across devices
- User authentication (Google Sign-In)
- Cloud storage for transcripts

> See [TESTING.md](TESTING.md) for detailed Firebase setup instructions.

---

## 🎨 UI/UX Features

### Compact Side Panel (320px width)

- **Compact Header** (50px): Context selector, AI badge, user login
- **Tab Navigator**: Switch between Summary, Actions, Suggestions
- **Summary Tab**: Real-time summary with transcript stats
- **Actions Tab**: Interactive action items with checkboxes
- **Suggestions Tab**: Highlighted suggestion cards
- **Bottom Action Bar**: Channel selection, end & send notes
- **Mode Switcher**: Toggle between Capture/History/Detail

---

## 🔧 Troubleshooting

### GLM API Error

- ✅ Check API key is correct
- ✅ Verify API key hasn't been revoked
- ✅ Log in to https://open.bigmodel.cn/ to check balance

### Captions Not Capturing

- ✅ Ensure captions are enabled in Google Meet (CC icon)
- ✅ Check captions are visible in UI
- ✅ Refresh Google Meet page
- ✅ Reload extension

### AI Not Responding in Vietnamese

- ✅ Check context prompts in `aiScheduler.ts`
- ✅ System prompts include "(in Vietnamese)"
- ✅ Rebuild extension: `npm run build`

> See [TESTING.md](TESTING.md) for more troubleshooting tips.

---

## 🛠️ Build & Development

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Pre-commit checks (Husky)
git commit
```

---

## 📊 Roadmap

- [x] Phase 1: Foundation & Core Communication
- [x] Phase 2: Context-Aware UI & Logic
- [x] Phase 3: AI Integration & Solution Suggestions
- [x] Phase 4: Multi-Channel Notification & Backend
- [x] Phase 5: Google Meet Optimized UI/UX Design
- [x] Phase 6: Meeting History Management & Cloud Sync
- [ ] Phase 7: Advanced Features (TBD)
  - [ ] Meeting templates
  - [ ] Custom prompts
  - [ ] Voice commands
  - [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for code style and guidelines.

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- [Testing Guide](TESTING.md) - Detailed testing instructions
- [Environment Variables](ENV_EXAMPLE.md) - API key configuration
- [Development Plan](meetassist_chrome_extension_development_plan_f4374fc8.plan%20copy.md) - Original development plan

---

**Built with ❤️ using React, TypeScript, and GLM-4 AI**
