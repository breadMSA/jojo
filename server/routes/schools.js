const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// 獲取所有學校列表
router.get('/', async (req, res) => {
  try {
    const schoolsSnapshot = await db.collection('schools').get();
    const schools = [];
    
    schoolsSnapshot.forEach(doc => {
      schools.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(schools);
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({ error: 'Failed to get schools' });
  }
});

// 根據ID獲取學校
router.get('/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    const schoolDoc = await db.collection('schools').doc(schoolId).get();
    
    if (!schoolDoc.exists) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    res.json({
      id: schoolDoc.id,
      ...schoolDoc.data()
    });
  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({ error: 'Failed to get school' });
  }
});

// 創建新學校（首個用戶設定作息）
router.post('/', async (req, res) => {
  try {
    const { name, schedule, createdBy } = req.body;
    
    // 檢查學校是否已存在
    const existingSchool = await db.collection('schools')
      .where('name', '==', name)
      .limit(1)
      .get();
    
    if (!existingSchool.empty) {
      return res.status(400).json({ error: 'School already exists' });
    }
    
    // 創建新學校
    const schoolRef = await db.collection('schools').add({
      name,
      schedule, // 作息表：{ periods: [{ start: "08:00", end: "09:00", name: "第1節" }] }
      createdBy,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });
    
    res.status(201).json({ 
      message: 'School created successfully',
      schoolId: schoolRef.id 
    });
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({ error: 'Failed to create school' });
  }
});

// 更新學校作息（只有創建者可以更新）
router.put('/:schoolId/schedule', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { schedule, updatedBy } = req.body;
    
    const schoolRef = db.collection('schools').doc(schoolId);
    const schoolDoc = await schoolRef.get();
    
    if (!schoolDoc.exists) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    const schoolData = schoolDoc.data();
    
    // 檢查是否為創建者
    if (schoolData.createdBy !== updatedBy) {
      return res.status(403).json({ error: 'Only the creator can update school schedule' });
    }
    
    await schoolRef.update({
      schedule,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy
    });
    
    res.json({ message: 'School schedule updated successfully' });
  } catch (error) {
    console.error('Update school schedule error:', error);
    res.status(500).json({ error: 'Failed to update school schedule' });
  }
});

// 搜尋學校
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const schoolsSnapshot = await db.collection('schools')
      .where('name', '>=', query)
      .where('name', '<=', query + '\uf8ff')
      .get();
    
    const schools = [];
    schoolsSnapshot.forEach(doc => {
      schools.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(schools);
  } catch (error) {
    console.error('Search schools error:', error);
    res.status(500).json({ error: 'Failed to search schools' });
  }
});

module.exports = router;
