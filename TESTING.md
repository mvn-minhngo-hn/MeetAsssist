# 🧪 MeetAssist - Testing Guide

## 📋 Quick Start (5 phút để test AI features)

### Bước 1: Lấy GLM API Key (Miễn phí & Nhanh nhất)

1. Truy cập **https://open.bigmodel.cn/**
2. Đăng ký tài khoản (email hoặc WeChat)
3. Đăng nhập → Vào **"API Keys"** → Click **"Create new API key"**
4. Copy API key (bắt đầu bằng `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Bước 2: Cấu hình API Key trong Extension

**Cách 1: Sửa file `.env` (Khuyến nghị)**

```bash
# Tạo file .env trong thư mục gốc
cat > .env << EOF
VITE_GLM_API_KEY=your_actual_glm_api_key_here
EOF
```

**Cách 2: Nhập trực tiếp trong UI**

1. Load extension vào Chrome
2. Mở side panel
3. Click icon Settings (⚙️)
4. Chọn **GLM** làm AI Provider
5. Dán API Key vào trường **API Key**
6. Click **Save**

### Bước 3: Build & Load Extension

```bash
# Build extension
npm run build

# Load vào Chrome
# 1. Mở chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Chọn thư mục dist/
```

### Bước 4: Test AI Features

**Phương pháp 1: Test với Google Meet thực tế**

1. Truy cập **https://meet.google.com/**
2. Tạo một cuộc họp (có thể test một mình)
3. Bật **captions** (CC icon) → Chọn "English"
4. Mở MeetAssist extension (icon side panel)
5. Click **"Start Capture"** (🔴)
6. Nói chuyện vài câu trong Google Meet
7. Wait ~3-5 giây để AI xử lý
8. Kiểm tra:
   - ✅ **Summary Tab**: Xem tóm tắt tiếng Việt
   - ✅ **Actions Tab**: Xem action items
   - ✅ **Suggestions Tab**: Xem gợi ý solutions

**Phương pháp 2: Test với Mock Captions (Nhanh hơn)**

Tôi có thể tạo một test component để gửi mock captions nhanh. Bạn có muốn không?

---

## 🌐 Cấu hình Firebase (Tùy chọn - Chỉ cần cho Meeting History)

Firebase **KHÔNG BẮT BUỘC** nếu chỉ test AI features!

### Khi nào cần Firebase?

- ❌ **KHÔNG cần**: Test AI summary, action items, suggestions
- ✅ **Cần**: Xem lịch sử cuộc họp, lưu meetings, search history

### Cách cấu hình Firebase

1. Truy cập **https://console.firebase.google.com/**
2. Click **"Add project"** → Đặt tên (ví dụ: `meetassist-<your-name>`)
3. Bỏ qua Google Analytics → Click **"Create project"**

### Enable Services

**Authentication:**
1. Vào **Build → Authentication**
2. Click **"Get started"**
3. Chọn **"Google"** sign-in provider
4. Enable → Save

**Firestore:**
1. Vào **Build → Firestore Database**
2. Click **"Create database"**
3. Chọn location (nên chọn gần bạn, ví dụ: `asia-southeast1`)
4. Chọn **"Production mode"** → Create
5. Tạo collection `users` (có thể bỏ qua rules tạm thời)

### Lấy Firebase Config Keys

1. Vào **Project Settings** (⚙️ icon) → **General**
2. Scroll xuống → **Your apps** → Click **</>** (Web icon)
3. Đặt tên app: "MeetAssist Extension" → Register
4. **KHÔNG cần cài đặt Firebase SDK** (chỉ cần config)
5. Copy config keys vào file `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=meetassist-yourname.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meetassist-yourname
VITE_FIREBASE_STORAGE_BUCKET=meetassist-yourname.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Rebuild Extension

```bash
npm run build
# Reload extension trong Chrome
```

---

## 🔧 Troubleshooting

### Issue 1: "GLM API Error"

**Symptom:** Extension báo lỗi khi gọi API

**Solutions:**
- ✅ Kiểm tra API key có đúng không
- ✅ Kiểm tra API key chưa bị revoke
- ✅ Đăng nhập lại https://open.bigmodel.cn/ để xem balance

### Issue 2: Không capture được captions

**Symptom:** Transcript không cập nhật

**Solutions:**
- ✅ Kiểm tra captions đã bật trong Google Meet (CC icon)
- ✅ Kiểm tra captions đang hiển thị trong UI
- ✅ Refresh Google Meet page
- ✅ Reload extension

### Issue 3: AI không trả lời tiếng Việt

**Symptom:** Summary trả về tiếng Anh

**Solutions:**
- ✅ Kiểm tra context prompt trong `aiScheduler.ts`
- ✅ System prompt đã bao gồm "(in Vietnamese)"
- ✅ Rebuild extension: `npm run build`

### Issue 4: Firestore permission denied

**Symptom:** Extension báo lỗi khi lưu meetings

**Solutions:**
- ✅ Kiểm tra Firestore rules → Có thể cần allow all (development mode):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 📊 Test Checklist

### AI Features (Không cần Firebase)

- [ ] ✅ Tạo GLM API key
- [ ] ✅ Build extension thành công
- [ ] ✅ Load extension vào Chrome
- [ ] ✅ Mở side panel
- [ ] ✅ Start capture
- [ ] ✅ Captions được scrape từ Google Meet
- [ ] ✅ AI summary hiển thị (tiếng Việt)
- [ ] ✅ Action items được tạo
- [ ] ✅ Suggestions hiển thị
- [ ] ✅ Stop capture hoạt động

### Cloud Sync Features (Cần Firebase)

- [ ] ✅ Tạo Firebase project
- [ ] ✅ Enable Authentication (Google)
- [ ] ✅ Enable Firestore Database
- [ ] ✅ Cấu hình Firebase keys
- [ ] ✅ Login bằng Google thành công
- [ ] ✅ Lưu meeting vào Firestore
- [ ] ✅ Load meeting history
- [ ] ✅ View meeting detail
- [ ] ✅ Search meetings
- [ ] ✅ Filter by context (technical/business/general)

---

## 🚀 Next Steps Sau Khi Test

1. **Cải thiện Prompts**: Tùy chỉnh prompts trong `aiScheduler.ts` để phù hợp với nhu cầu của bạn
2. **Tùy chỉnh Context Types**: Thêm thêm loại context (ví dụ: `design`, `marketing`)
3. **Tích hợp Slack/Discord**: Thêm webhooks để gửi meeting notes đến channel
4. **Deploy Firebase Functions**: Để gửi email notifications tự động

---

## 💡 Tips

- **GLM-4-5-Air** rất mạnh và hỗ trợ tiếng Việt tốt
- Nếu gặp rate limit, thử đổi sang OpenAI hoặc Gemini
- Firebase có **Spark plan miễn phí** (50k reads, 20k writes/ngày)
- Meeting transcripts được lưu trong `chrome.storage.local` (offline)

---

## 📞 Hỗ trợ

- GLM Docs: https://open.bigmodel.cn/dev/api
- Firebase Docs: https://firebase.google.com/docs
- Chrome Extension: https://developer.chrome.com/docs/extensions/mv3/

