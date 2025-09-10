const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const router = express.Router();

// 配置multer用於文件上傳
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// OCR處理課表圖片
router.post('/process', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // 使用sharp預處理圖片
    const processedImageBuffer = await sharp(req.file.buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .grayscale()
      .normalize()
      .sharpen()
      .png()
      .toBuffer();
    
    // 使用Tesseract進行OCR
    const { data: { text } } = await Tesseract.recognize(
      processedImageBuffer,
      'chi_tra+eng', // 中文繁體 + 英文
      {
        logger: m => console.log(m)
      }
    );
    
    // 解析課表文字
    const parsedSchedule = parseScheduleText(text);
    
    res.json({
      originalText: text,
      parsedSchedule,
      success: true
    });
    
  } catch (error) {
    console.error('OCR processing error:', error);
    res.status(500).json({ 
      error: 'OCR processing failed',
      message: error.message 
    });
  }
});

// 解析課表文字的輔助函數
function parseScheduleText(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const schedule = {
    courses: [],
    errors: []
  };
  
  // 常見的課表格式模式
  const patterns = {
    // 時間格式：08:00-09:00, 8:00-9:00, 08:00~09:00
    timeRange: /(\d{1,2}):(\d{2})\s*[-~]\s*(\d{1,2}):(\d{2})/g,
    // 星期：星期一, 週一, Mon, Monday
    dayOfWeek: /(?:星期|週|周)([一二三四五六日天])|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g,
    // 課程名稱：通常包含中文或英文
    courseName: /[\u4e00-\u9fff\w\s]+/g
  };
  
  // 星期對應表
  const dayMap = {
    '一': 'monday', '二': 'tuesday', '三': 'wednesday', 
    '四': 'thursday', '五': 'friday', '六': 'saturday', '日': 'sunday', '天': 'sunday',
    'Mon': 'monday', 'Tue': 'tuesday', 'Wed': 'wednesday',
    'Thu': 'thursday', 'Fri': 'friday', 'Sat': 'saturday', 'Sun': 'sunday'
  };
  
  let currentDay = null;
  let currentTime = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 檢查是否為星期
    const dayMatch = line.match(patterns.dayOfWeek);
    if (dayMatch) {
      const dayKey = dayMatch[0].replace(/[星期週周]/, '');
      currentDay = dayMap[dayKey] || dayMap[dayMatch[0]];
      continue;
    }
    
    // 檢查是否包含時間範圍
    const timeMatch = line.match(patterns.timeRange);
    if (timeMatch) {
      const [, startHour, startMin, endHour, endMin] = timeMatch[0].match(/(\d{1,2}):(\d{2})\s*[-~]\s*(\d{1,2}):(\d{2})/);
      currentTime = {
        start: `${startHour.padStart(2, '0')}:${startMin}`,
        end: `${endHour.padStart(2, '0')}:${endMin}`
      };
    }
    
    // 如果找到課程名稱且有所需資訊
    if (currentDay && currentTime && line.length > 2) {
      const courseName = line.replace(patterns.timeRange, '').trim();
      
      if (courseName && !courseName.match(/^\d+$/)) { // 不是純數字
        schedule.courses.push({
          name: courseName,
          day: currentDay,
          startTime: currentTime.start,
          endTime: currentTime.end,
          period: generatePeriodName(currentTime.start, currentTime.end)
        });
      }
    }
  }
  
  // 如果沒有解析到任何課程，提供錯誤資訊
  if (schedule.courses.length === 0) {
    schedule.errors.push('無法從圖片中識別出課表資訊，請確認圖片清晰且包含完整的課表');
  }
  
  return schedule;
}

// 根據時間生成節次名稱
function generatePeriodName(startTime, endTime) {
  const timeToPeriod = {
    '08:00': '第1節', '09:00': '第2節', '10:00': '第3節', '11:00': '第4節',
    '12:00': '第5節', '13:00': '第6節', '14:00': '第7節', '15:00': '第8節',
    '16:00': '第9節', '17:00': '第10節', '18:00': '第11節', '19:00': '第12節',
    '20:00': '第13節', '21:00': '第14節', '22:00': '第15節'
  };
  
  return timeToPeriod[startTime] || `第${Math.floor(parseInt(startTime.split(':')[0]) - 7)}節`;
}

// 獲取OCR處理建議
router.get('/tips', (req, res) => {
  res.json({
    tips: [
      '請確保課表圖片清晰，文字清楚可讀',
      '避免反光或陰影影響文字識別',
      '課表應包含完整的時間和課程資訊',
      '建議使用高解析度圖片（至少1000x1000像素）',
      '如果識別結果不準確，可以手動調整課程資訊',
      '支援中文和英文混合的課表格式'
    ],
    supportedFormats: ['PNG', 'JPEG', 'JPG', 'GIF', 'BMP', 'WEBP'],
    maxFileSize: '10MB'
  });
});

module.exports = router;
