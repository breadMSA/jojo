const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// 用戶註冊/登入（使用Firebase Auth）
router.post('/register', async (req, res) => {
  try {
    const { uid, email, displayName, schoolId, photoURL } = req.body;
    
    // 檢查用戶是否已存在
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // 創建新用戶
    await userRef.set({
      uid,
      email,
      displayName,
      schoolId: schoolId || null, // Google登入用戶可能沒有學校ID
      photoURL: photoURL || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      settings: {
        showCourseNames: true, // 預設顯示課程名稱
        privacy: 'friends' // friends, public, private
      }
    });
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 檢查用戶是否存在（用於Google登入）
router.get('/check/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      res.json({ exists: true, user: userDoc.data() });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ error: 'Failed to check user' });
  }
});

// 更新用戶資料
router.put('/profile', async (req, res) => {
  try {
    const { uid, displayName, schoolId, settings } = req.body;
    
    const userRef = db.collection('users').doc(uid);
    const updateData = {
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    if (displayName) updateData.displayName = displayName;
    if (schoolId) updateData.schoolId = schoolId;
    if (settings) updateData.settings = settings;
    
    await userRef.update(updateData);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// 獲取用戶資料
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    // 移除敏感資訊
    delete userData.uid;
    
    res.json(userData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

module.exports = router;
