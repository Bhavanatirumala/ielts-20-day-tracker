const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getLeaderboard } = require('../controllers/profileController');

router.get('/profile', auth, getProfile);
router.post('/profile', auth, updateProfile);
router.get('/leaderboard', getLeaderboard);

module.exports = router; 