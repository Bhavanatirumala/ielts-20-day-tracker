const express = require('express');
const router = express.Router();
const { getUserProgress, updateUserProgress } = require('../controllers/progressController');
const auth = require('../middleware/authMiddleware');

router.get('/progress', auth, getUserProgress);
router.post('/progress', auth, updateUserProgress);

module.exports = router; 