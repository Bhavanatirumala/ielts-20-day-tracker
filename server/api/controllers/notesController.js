const User = require('../models/userModel');

// @desc    Get user notes
// @route   GET /api/notes
// @access  Private
const getUserNotes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notes');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Save or update a user's note for a day
// @route   POST /api/notes
// @access  Private
const saveUserNote = async (req, res) => {
  const { day, content } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const noteIndex = user.notes.findIndex(n => n.day === day);

    if (noteIndex > -1) {
      // Update existing note
      user.notes[noteIndex].content = content;
    } else {
      // Add new note
      user.notes.push({ day, content });
    }

    await user.save();
    res.json(user.notes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getUserNotes,
  saveUserNote,
}; 