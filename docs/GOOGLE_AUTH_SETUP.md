# Google 登入設定指南

## 1. Firebase 設定

### 1.1 啟用 Google 登入
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案
3. 點擊「Authentication」→「登入方式」
4. 找到「Google」並點擊啟用
5. 設定專案支援電子郵件地址
6. 點擊「儲存」

### 1.2 設定 OAuth 同意畫面（可選但建議）
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇相同的專案
3. 前往「APIs & Services」→「OAuth consent screen」
4. 選擇「External」用戶類型
5. 填寫應用程式資訊：
   - 應用程式名稱：Better Schedule
   - 用戶支援電子郵件：你的郵件
   - 開發者聯絡資訊：你的郵件
6. 添加範圍（可選）：
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
7. 添加測試用戶（開發階段）
8. 儲存設定

## 2. 環境變數設定

確保你的環境變數已正確設定：

### 前端 (.env)
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 後端 (.env)
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 3. 測試 Google 登入

### 3.1 本地測試
1. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

2. 前往 http://localhost:3000
3. 點擊「使用 Google 登入」
4. 選擇 Google 帳號並授權
5. 檢查是否成功登入

### 3.2 檢查資料庫
1. 前往 Firebase Console → Firestore Database
2. 查看 `users` 集合
3. 確認新用戶資料已創建

## 4. 常見問題

### Q: Google 登入按鈕沒有出現
A: 檢查 Firebase 設定是否正確，確認 Google 登入已啟用

### Q: 登入後出現錯誤
A: 檢查後端 API 是否正常運行，查看瀏覽器控制台錯誤訊息

### Q: 用戶資料沒有創建
A: 檢查後端日誌，確認 API 呼叫是否成功

### Q: 頭像沒有顯示
A: 檢查 `photoURL` 欄位是否正確設定

## 5. 部署注意事項

### 5.1 生產環境設定
1. 在 Firebase Console 中添加授權網域：
   - 你的生產網域（如：https://your-app.com）
   - 本地開發網域（如：http://localhost:3000）

2. 更新 OAuth 同意畫面：
   - 添加生產網域到授權重定向 URI
   - 發布應用程式（如果需要的話）

### 5.2 環境變數
確保生產環境的環境變數已正確設定，特別是：
- `REACT_APP_API_BASE_URL` 指向你的後端 API
- `CLIENT_URL` 指向你的前端網域

## 6. 安全考量

1. **API 金鑰保護**：雖然 Firebase API 金鑰可以公開，但建議設定適當的網域限制
2. **用戶資料驗證**：後端會驗證 Firebase ID Token
3. **隱私設定**：用戶可以控制資料可見性

## 7. 功能特色

- **一鍵登入**：用戶無需記住密碼
- **自動頭像**：使用 Google 帳號頭像
- **資料同步**：自動同步 Google 帳號資訊
- **安全可靠**：使用 Google 的安全驗證系統

## 8. 後續開發

如果需要添加更多 Google 功能：
- Google Calendar 整合
- Google Drive 檔案分享
- Google Meet 會議連結
- 更多 Google 服務 API

記住要遵循 Google 的使用政策和隱私要求。
