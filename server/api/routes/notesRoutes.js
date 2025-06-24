const express = require('express');
const router = express.Router();
const { getUserNotes, saveUserNote } = require('../controllers/notesController');
const auth = require('../middleware/authMiddleware');

router.get('/notes', auth, getUserNotes);
router.post('/notes', auth, saveUserNote);

module.exports = router; 