const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// 發送好友請求
router.post('/request', async (req, res) => {
  try {
    const { fromUserId, toUserId, message } = req.body;
    
    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }
    
    // 檢查是否已經是好友
    const friendshipDoc = await db.collection('friendships')
      .where('users', 'array-contains', fromUserId)
      .where('status', '==', 'accepted')
      .get();
    
    if (!friendshipDoc.empty) {
      return res.status(400).json({ error: 'Already friends' });
    }
    
    // 檢查是否已有待處理的請求
    const existingRequest = await db.collection('friendRequests')
      .where('fromUserId', '==', fromUserId)
      .where('toUserId', '==', toUserId)
      .where('status', '==', 'pending')
      .get();
    
    if (!existingRequest.empty) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }
    
    // 創建好友請求
    await db.collection('friendRequests').add({
      fromUserId,
      toUserId,
      message: message || '',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// 獲取好友請求
router.get('/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requestsSnapshot = await db.collection('friendRequests')
      .where('toUserId', '==', userId)
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();
    
    const requests = [];
    
    for (const doc of requestsSnapshot.docs) {
      const requestData = doc.data();
      
      // 獲取發送者資訊
      const fromUserDoc = await db.collection('users').doc(requestData.fromUserId).get();
      if (fromUserDoc.exists) {
        requests.push({
          id: doc.id,
          ...requestData,
          fromUser: fromUserDoc.data()
        });
      }
    }
    
    res.json(requests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ error: 'Failed to get friend requests' });
  }
});

// 回應好友請求
router.put('/requests/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    
    const requestRef = db.collection('friendRequests').doc(requestId);
    const requestDoc = await requestRef.get();
    
    if (!requestDoc.exists) {
      return res.status(404).json({ error: 'Friend request not found' });
    }
    
    const requestData = requestDoc.data();
    
    if (requestData.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }
    
    // 更新請求狀態
    await requestRef.update({
      status,
      respondedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // 如果接受，創建好友關係
    if (status === 'accepted') {
      await db.collection('friendships').add({
        users: [requestData.fromUserId, requestData.toUserId],
        status: 'accepted',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    res.json({ message: `Friend request ${status} successfully` });
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ error: 'Failed to respond to friend request' });
  }
});

// 獲取好友列表
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const friendshipsSnapshot = await db.collection('friendships')
      .where('users', 'array-contains', userId)
      .where('status', '==', 'accepted')
      .get();
    
    const friends = [];
    
    for (const doc of friendshipsSnapshot.docs) {
      const friendship = doc.data();
      const friendId = friendship.users.find(id => id !== userId);
      
      // 獲取好友資訊
      const friendDoc = await db.collection('users').doc(friendId).get();
      if (friendDoc.exists) {
        friends.push({
          id: friendId,
          ...friendDoc.data(),
          friendshipId: doc.id
        });
      }
    }
    
    res.json(friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to get friends' });
  }
});

// 移除好友
router.delete('/:friendshipId', async (req, res) => {
  try {
    const { friendshipId } = req.params;
    
    await db.collection('friendships').doc(friendshipId).delete();
    
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// 搜尋用戶（用於添加好友）
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { excludeUserId } = req.query;
    
    let usersQuery = db.collection('users')
      .where('displayName', '>=', query)
      .where('displayName', '<=', query + '\uf8ff')
      .limit(10);
    
    const usersSnapshot = await usersQuery.get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.uid !== excludeUserId) {
        users.push({
          id: doc.id,
          uid: userData.uid,
          displayName: userData.displayName,
          schoolId: userData.schoolId
        });
      }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

module.exports = router;
