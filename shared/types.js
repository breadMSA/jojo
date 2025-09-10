// 共享的類型定義和常數

// 用戶相關類型
export const UserTypes = {
  // 用戶資料結構
  User: {
    uid: 'string',
    email: 'string',
    displayName: 'string',
    schoolId: 'string',
    createdAt: 'timestamp',
    lastLoginAt: 'timestamp',
    settings: {
      showCourseNames: 'boolean',
      privacy: 'string' // 'friends', 'public', 'private'
    }
  },
  
  // 用戶設定
  UserSettings: {
    showCourseNames: 'boolean',
    privacy: 'string'
  }
};

// 學校相關類型
export const SchoolTypes = {
  // 學校資料結構
  School: {
    id: 'string',
    name: 'string',
    schedule: {
      periods: [{
        name: 'string', // 第1節, 第2節...
        start: 'string', // 08:00
        end: 'string'    // 09:00
      }]
    },
    createdBy: 'string',
    createdAt: 'timestamp',
    isActive: 'boolean'
  },
  
  // 節次資料結構
  Period: {
    name: 'string',
    start: 'string',
    end: 'string'
  }
};

// 課表相關類型
export const ScheduleTypes = {
  // 課程資料結構
  Course: {
    id: 'string',
    name: 'string',
    day: 'string', // monday, tuesday...
    period: 'string', // 第1節, 第2節...
    startTime: 'string', // 08:00
    endTime: 'string',   // 09:00
    location: 'string',  // 教室
    instructor: 'string', // 老師
    credits: 'number'    // 學分
  },
  
  // 忙碌時段
  BusyTime: {
    id: 'string',
    name: 'string', // 打工, 上班, 其他活動
    day: 'string',
    startTime: 'string',
    endTime: 'string',
    type: 'string', // 'work', 'study', 'other'
    description: 'string'
  },
  
  // 課表資料結構
  Schedule: {
    courses: 'Course[]',
    busyTimes: 'BusyTime[]',
    lastUpdated: 'timestamp'
  },
  
  // 共同空堂查詢結果
  CommonFreeTime: {
    day: 'string',
    period: 'string',
    startTime: 'string',
    endTime: 'string',
    duration: 'number' // 分鐘
  }
};

// 好友系統類型
export const FriendTypes = {
  // 好友請求
  FriendRequest: {
    id: 'string',
    fromUserId: 'string',
    toUserId: 'string',
    message: 'string',
    status: 'string', // 'pending', 'accepted', 'rejected'
    createdAt: 'timestamp',
    respondedAt: 'timestamp'
  },
  
  // 好友關係
  Friendship: {
    id: 'string',
    users: 'string[]', // [userId1, userId2]
    status: 'string', // 'accepted'
    createdAt: 'timestamp'
  }
};

// OCR相關類型
export const OCRTypes = {
  // OCR處理結果
  OCRResult: {
    originalText: 'string',
    parsedSchedule: {
      courses: 'Course[]',
      errors: 'string[]'
    },
    success: 'boolean'
  }
};

// 常數定義
export const Constants = {
  // 星期對應
  DAYS: {
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日'
  },
  
  // 隱私設定
  PRIVACY: {
    PRIVATE: 'private',
    FRIENDS: 'friends',
    PUBLIC: 'public'
  },
  
  // 忙碌時段類型
  BUSY_TIME_TYPES: {
    WORK: 'work',
    STUDY: 'study',
    OTHER: 'other'
  },
  
  // 預設節次時間（台大）
  DEFAULT_PERIODS: [
    { name: '第1節', start: '08:00', end: '09:00' },
    { name: '第2節', start: '09:00', end: '10:00' },
    { name: '第3節', start: '10:00', end: '11:00' },
    { name: '第4節', start: '11:00', end: '12:00' },
    { name: '第5節', start: '12:00', end: '13:00' },
    { name: '第6節', start: '13:00', end: '14:00' },
    { name: '第7節', start: '14:00', end: '15:00' },
    { name: '第8節', start: '15:00', end: '16:00' },
    { name: '第9節', start: '16:00', end: '17:00' },
    { name: '第10節', start: '17:00', end: '18:00' },
    { name: '第11節', start: '18:00', end: '19:00' },
    { name: '第12節', start: '19:00', end: '20:00' },
    { name: '第13節', start: '20:00', end: '21:00' },
    { name: '第14節', start: '21:00', end: '22:00' },
    { name: '第15節', start: '22:00', end: '23:00' }
  ]
};

// 工具函數
export const Utils = {
  // 格式化時間
  formatTime: (time) => {
    const [hour, minute] = time.split(':');
    return `${hour.padStart(2, '0')}:${minute}`;
  },
  
  // 計算時長
  calculateDuration: (startTime, endTime) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    return (end - start) / (1000 * 60); // 分鐘
  },
  
  // 檢查時間重疊
  isTimeOverlap: (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  },
  
  // 生成唯一ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};
