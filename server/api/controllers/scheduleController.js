const schedule = require('../../config/schedule');

// @desc    Get the 20-day schedule
// @route   GET /api/schedule
// @access  Public
const getSchedule = (req, res) => {
  try {
    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getSchedule,
}; 