# 快速開始指南

## 環境需求

- Node.js 18+ 
- npm 或 yarn
- Firebase 專案
- Git

## 1. 克隆專案

```bash
git clone https://github.com/your-username/better-schedule.git
cd better-schedule
```

## 2. 安裝依賴

```bash
# 安裝所有依賴
npm run install-all

# 或分別安裝
npm install
cd server && npm install
cd ../client && npm install
```

## 3. 設定 Firebase

### 3.1 創建 Firebase 專案
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」
3. 輸入專案名稱（例如：better-schedule）
4. 啟用 Google Analytics（可選）

### 3.2 啟用 Authentication
1. 在 Firebase Console 中，點擊「Authentication」
2. 點擊「開始使用」
3. 在「登入方法」標籤中，啟用「電子郵件/密碼」

### 3.3 啟用 Firestore Database
1. 在 Firebase Console 中，點擊「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「測試模式」（開發階段）
4. 選擇地理位置（建議選擇離您最近的）

### 3.4 獲取 Firebase 配置
1. 在專案設定中，點擊「一般」標籤
2. 在「您的應用程式」部分，點擊「Web」圖示
3. 輸入應用程式暱稱（例如：better-schedule-web）
4. 複製 Firebase 配置物件

### 3.5 生成服務帳戶金鑰
1. 在專案設定中，點擊「服務帳戶」標籤
2. 點擊「產生新的私密金鑰」
3. 下載 JSON 檔案並保存

## 4. 設定環境變數

### 4.1 後端環境變數
```bash
# 複製範例檔案
cp server/env.example server/.env

# 編輯 server/.env
```

填入以下內容：
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4.2 前端環境變數
```bash
# 複製範例檔案
cp client/env.example client/.env

# 編輯 client/.env
```

填入以下內容：
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## 5. 啟動開發伺服器

```bash
# 同時啟動前端和後端
npm run dev

# 或分別啟動
# 終端機 1: 啟動後端
npm run server

# 終端機 2: 啟動前端
npm run client
```

## 6. 訪問應用程式

- 前端：http://localhost:3000
- 後端 API：http://localhost:5000

## 7. 首次使用

### 7.1 註冊帳戶
1. 在瀏覽器中打開 http://localhost:3000
2. 點擊「註冊」
3. 填寫註冊資訊
4. 選擇學校（如果是第一個用戶，需要創建學校）

### 7.2 創建學校作息
1. 在設定頁面中，點擊「新增學校」
2. 輸入學校名稱
3. 設定節次時間（預設為台大作息）
4. 保存設定

### 7.3 管理課表
1. 前往「我的課表」頁面
2. 點擊「新增課程」添加課程
3. 或使用「OCR匯入」上傳課表圖片
4. 添加忙碌時段（打工、上班等）

### 7.4 添加好友
1. 前往「好友」頁面
2. 點擊「新增好友」
3. 搜尋用戶並發送好友請求
4. 接受好友請求

### 7.5 查看共同空堂
1. 選擇好友
2. 系統會自動計算共同空閒時間
3. 顯示實際時間而非節次

## 8. 常見問題

### Q: 後端啟動失敗
A: 檢查環境變數是否正確設定，特別是 Firebase 配置

### Q: 前端無法連接到後端
A: 檢查 `REACT_APP_API_BASE_URL` 是否正確

### Q: OCR 功能無法使用
A: 確保上傳的圖片清晰，支援的格式包括 PNG、JPEG、JPG

### Q: 課表顯示異常
A: 檢查學校作息設定是否正確

## 9. 開發工具

### 9.1 程式碼格式化
```bash
# 格式化 TypeScript/JavaScript
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"

# 檢查程式碼品質
npx eslint "src/**/*.{ts,tsx,js,jsx}"
```

### 9.2 測試
```bash
# 執行前端測試
cd client && npm test

# 執行後端測試
cd server && npm test
```

### 9.3 建構生產版本
```bash
# 建構前端
cd client && npm run build

# 建構後端
cd server && npm run build
```

## 10. 部署

詳細的部署說明請參考 [部署指南](DEPLOYMENT.md)

### 快速部署到 Render
1. 將程式碼推送到 GitHub
2. 在 Render 創建 Web Service（後端）
3. 在 Render 創建 Static Site（前端）
4. 設定環境變數
5. 部署

## 11. 貢獻

歡迎貢獻程式碼！請參考：
1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 發送 Pull Request

## 12. 支援

如果遇到問題：
1. 查看 [常見問題](FAQ.md)
2. 搜尋 [GitHub Issues](https://github.com/your-username/better-schedule/issues)
3. 創建新的 Issue
4. 聯絡開發團隊

## 13. 授權

本專案使用 MIT 授權，詳見 [LICENSE](../LICENSE) 檔案。
