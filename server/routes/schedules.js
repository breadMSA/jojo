const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// 獲取用戶課表
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const scheduleDoc = await db.collection('schedules').doc(uid).get();
    
    if (!scheduleDoc.exists) {
      return res.json({
        courses: [],
        busyTimes: [],
        lastUpdated: null
      });
    }
    
    res.json(scheduleDoc.data());
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Failed to get schedule' });
  }
});

// 更新課表
router.put('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { courses, busyTimes } = req.body;
    
    const scheduleData = {
      courses: courses || [],
      busyTimes: busyTimes || [],
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('schedules').doc(uid).set(scheduleData, { merge: true });
    
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// 獲取多個用戶的課表（用於共同空堂查詢）
router.post('/batch', async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'User IDs array is required' });
    }
    
    const schedules = {};
    
    // 並行獲取所有課表
    const promises = userIds.map(async (userId) => {
      const scheduleDoc = await db.collection('schedules').doc(userId).get();
      if (scheduleDoc.exists) {
        schedules[userId] = scheduleDoc.data();
      } else {
        schedules[userId] = { courses: [], busyTimes: [] };
      }
    });
    
    await Promise.all(promises);
    
    res.json(schedules);
  } catch (error) {
    console.error('Get batch schedules error:', error);
    res.status(500).json({ error: 'Failed to get schedules' });
  }
});

// 計算共同空堂
router.post('/common-free', async (req, res) => {
  try {
    const { userIds, schoolId, startDate, endDate } = req.body;
    
    // 獲取學校作息
    const schoolDoc = await db.collection('schools').doc(schoolId).get();
    if (!schoolDoc.exists) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    const schoolSchedule = schoolDoc.data().schedule;
    
    // 獲取所有用戶課表
    const schedules = {};
    const promises = userIds.map(async (userId) => {
      const scheduleDoc = await db.collection('schedules').doc(userId).get();
      if (scheduleDoc.exists) {
        schedules[userId] = scheduleDoc.data();
      } else {
        schedules[userId] = { courses: [], busyTimes: [] };
      }
    });
    
    await Promise.all(promises);
    
    // 計算共同空堂
    const commonFreeTimes = calculateCommonFreeTimes(schedules, schoolSchedule, startDate, endDate);
    
    res.json({
      commonFreeTimes,
      schoolSchedule,
      participants: userIds.length
    });
  } catch (error) {
    console.error('Calculate common free times error:', error);
    res.status(500).json({ error: 'Failed to calculate common free times' });
  }
});

// 計算共同空堂的輔助函數
function calculateCommonFreeTimes(schedules, schoolSchedule, startDate, endDate) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const commonFreeTimes = {};
  
  days.forEach(day => {
    commonFreeTimes[day] = [];
    
    // 對每個時段檢查是否所有人都空閒
    schoolSchedule.periods.forEach(period => {
      let isCommonFree = true;
      
      // 檢查每個用戶在這個時段是否空閒
      Object.values(schedules).forEach(schedule => {
        const hasCourse = schedule.courses.some(course => 
          course.day === day && 
          course.period === period.name &&
          isTimeInRange(course.startTime, course.endTime, period.start, period.end)
        );
        
        const hasBusyTime = schedule.busyTimes.some(busy => 
          busy.day === day &&
          isTimeInRange(busy.startTime, busy.endTime, period.start, period.end)
        );
        
        if (hasCourse || hasBusyTime) {
          isCommonFree = false;
        }
      });
      
      if (isCommonFree) {
        commonFreeTimes[day].push({
          period: period.name,
          startTime: period.start,
          endTime: period.end,
          duration: calculateDuration(period.start, period.end)
        });
      }
    });
  });
  
  return commonFreeTimes;
}

// 檢查時間是否重疊
function isTimeInRange(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

// 計算時長（分鐘）
function calculateDuration(start, end) {
  const startTime = new Date(`2000-01-01 ${start}`);
  const endTime = new Date(`2000-01-01 ${end}`);
  return (endTime - startTime) / (1000 * 60);
}

module.exports = router;
