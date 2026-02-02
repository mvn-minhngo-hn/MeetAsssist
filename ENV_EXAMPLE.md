# ============================================
# MeetAssist Chrome Extension - Environment Variables
# ============================================

# ------------------------
# AI Provider Keys (BẮT BUỘC CHO AI FEATURES)
# ------------------------
# Chọn 1 trong 3 providers dưới đây:

# GLM API Key (Zhipu AI / BigModel)
# Đăng ký miễn phí tại: https://open.bigmodel.cn/
VITE_GLM_API_KEY=your_glm_api_key_here

# Hoặc OpenAI API Key (nếu muốn dùng thay thế)
# Đăng ký tại: https://platform.openai.com/
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Hoặc Google Gemini API Key
# Đăng ký tại: https://aistudio.google.com/
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# ------------------------
# Firebase Configuration (CHỈ CẦN CHO CLOUD SYNC)
# ------------------------
# Nếu chỉ test AI features, KHÔNG cần cấu hình Firebase
# Nếu muốn dùng meeting history + cloud sync, hãy điền các field sau:

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# ============================================
# HƯỚNG DẪN LẤY API KEYS:
# ============================================
#
# 1. GLM API Key (NÊN DÙNG - Miễn phí & Nhanh):
#    - Truy cập: https://open.bigmodel.cn/
#    - Đăng ký tài khoản (bằng email hoặc WeChat)
#    - Tạo API Key trong phần "API Keys"
#    - Copy key vào VITE_GLM_API_KEY
#
# 2. Firebase Keys (TÙY CHỌN):
#    - Truy cập: https://console.firebase.google.com/
#    - Tạo project mới (miễn phí)
#    - Enable "Authentication" (Google Sign-In)
#    - Enable "Firestore Database" (Create database in production mode)
#    - Vào Project Settings > General > Your apps
#    - Thêm web app và lấy config keys
#
# ============================================

