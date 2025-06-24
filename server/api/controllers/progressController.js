const User = require('../models/userModel');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
const getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('progress');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user progress for a task
// @route   POST /api/progress
// @access  Private
const updateUserProgress = async (req, res) => {
  const { day, task, status } = req.body;

  if (!status || !['pending', 'done'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status. Must be "pending" or "done".' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find the task in user's progress and update its status
    const taskIndex = user.progress.findIndex(p => p.day === day && p.task === task);

    if (taskIndex > -1) {
      user.progress[taskIndex].status = status;
    } else {
        // This case should ideally not happen if progress is initialized correctly
        return res.status(404).json({ msg: 'Task not found for this user.' });
    }

    await user.save();
    res.json(user.progress);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getUserProgress,
  updateUserProgress,
}; 