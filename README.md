# Better Schedule - 更好的課表分享工具

一個功能更完善的課表分享工具，解決「不揪？」的各種限制。

## 主要功能

### 基礎功能
- 課表分享與查看
- 好友系統
- 共同空堂查詢

### 進階功能
- ✅ 跨校空堂查詢（顯示時間而非節次）
- ✅ 支援第10節以後的課程
- ✅ 課程名稱輸入與顯示切換
- ✅ 忙碌時段管理（打工/上班）
- ✅ OCR課表匯入
- ✅ 學校作息自動管理（首個用戶設定）

## 技術棧

- **前端**: React + TypeScript
- **後端**: Node.js + Express
- **資料庫**: Firebase Firestore
- **OCR**: Tesseract.js
- **部署**: Render

## 專案結構

```
├── client/          # React 前端
├── server/          # Node.js 後端
├── shared/          # 共享類型定義
└── docs/           # 文檔
```

## 開發

```bash
# 安裝所有依賴
npm run install-all

# 啟動開發環境
npm run dev
```

## 部署

前端和後端分別部署到 Render，資料庫使用 Firebase。
