# 部署指南

## 概述

Better Schedule 是一個全端網頁應用程式，包含 React 前端和 Node.js 後端，使用 Firebase 作為資料庫。

## 架構

- **前端**: React + TypeScript + Material-UI
- **後端**: Node.js + Express + Firebase Admin SDK
- **資料庫**: Firebase Firestore
- **OCR**: Tesseract.js
- **部署平台**: Render (推薦) 或 Docker

## 部署步驟

### 1. 準備 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 創建新專案或使用現有專案
3. 啟用 Authentication 和 Firestore Database
4. 在專案設定中生成服務帳戶金鑰
5. 下載服務帳戶 JSON 檔案

### 2. 設定環境變數

#### 後端環境變數 (server/.env)
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
```

#### 前端環境變數 (client/.env)
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_BASE_URL=https://your-backend-url.com/api
```

### 3. 部署到 Render

#### 後端部署
1. 在 Render 創建新的 Web Service
2. 連接 GitHub 儲存庫
3. 設定建構指令: `cd server && npm install`
4. 設定啟動指令: `cd server && npm start`
5. 添加環境變數
6. 部署

#### 前端部署
1. 在 Render 創建新的 Static Site
2. 連接 GitHub 儲存庫
3. 設定建構指令: `cd client && npm install && npm run build`
4. 設定發布目錄: `client/build`
5. 添加環境變數
6. 部署

### 4. 使用 Docker 部署

#### 本地開發
```bash
# 複製環境變數檔案
cp server/env.example server/.env
cp client/env.example client/.env

# 編輯環境變數
# 然後啟動服務
docker-compose up --build
```

#### 生產環境
```bash
# 設定環境變數
export FIREBASE_PROJECT_ID=your-project-id
export FIREBASE_PRIVATE_KEY="your-private-key"
export FIREBASE_CLIENT_EMAIL=your-client-email
export REACT_APP_FIREBASE_API_KEY=your-api-key
# ... 其他環境變數

# 啟動服務
docker-compose up -d --build
```

### 5. 手動部署

#### 後端
```bash
cd server
npm install
npm start
```

#### 前端
```bash
cd client
npm install
npm run build
# 將 build 目錄部署到靜態網站託管服務
```

## 資料庫初始化

部署完成後，需要初始化一些基本資料：

1. 創建第一個學校的作息設定
2. 設定預設的節次時間
3. 測試用戶註冊和登入功能

## 監控和維護

### 日誌監控
- 後端日誌: 檢查 Render 或 Docker 日誌
- 前端錯誤: 使用瀏覽器開發者工具
- Firebase 日誌: 在 Firebase Console 查看

### 效能優化
- 啟用 Firebase 快取
- 使用 CDN 加速靜態資源
- 監控 API 回應時間

### 安全考量
- 定期更新依賴套件
- 監控異常登入活動
- 備份重要資料

## 故障排除

### 常見問題

1. **Firebase 認證失敗**
   - 檢查環境變數是否正確
   - 確認 Firebase 專案設定

2. **API 連線失敗**
   - 檢查 CORS 設定
   - 確認後端 URL 正確

3. **OCR 功能異常**
   - 檢查圖片格式和大小
   - 確認 Tesseract.js 版本

4. **課表顯示問題**
   - 檢查學校作息設定
   - 確認時區設定正確

### 聯絡支援

如果遇到無法解決的問題，請：
1. 檢查日誌檔案
2. 確認環境變數設定
3. 查看 GitHub Issues
4. 聯絡開發團隊

## 更新部署

### 自動更新 (Render)
- 推送程式碼到 GitHub
- Render 會自動重新部署

### 手動更新
```bash
# 拉取最新程式碼
git pull origin main

# 重新建構和部署
docker-compose down
docker-compose up -d --build
```

## 備份策略

### 資料備份
- Firebase 自動備份
- 定期匯出 Firestore 資料
- 備份環境變數設定

### 程式碼備份
- GitHub 版本控制
- 定期建立 Release 標籤
- 備份重要設定檔案
