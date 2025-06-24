const User = require('../models/userModel');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email displayName nickname mobile dob profilePic progress notes showOnLeaderboard leaderboardName');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Calculate streak (number of unique days with at least one done task)
    const daysDone = new Set(user.progress.filter(p => p.status === 'done').map(p => p.day));
    const streak = daysDone.size;

    res.json({
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      nickname: user.nickname,
      mobile: user.mobile,
      dob: user.dob,
      profilePic: user.profilePic,
      progress: user.progress,
      notes: user.notes,
      streak,
      showOnLeaderboard: user.showOnLeaderboard,
      leaderboardName: user.leaderboardName,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { displayName, profilePic, nickname, mobile, dob, showOnLeaderboard, leaderboardName } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (displayName !== undefined) user.displayName = displayName;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (nickname !== undefined) user.nickname = nickname;
    if (mobile !== undefined) user.mobile = mobile;
    if (dob !== undefined) user.dob = dob;
    if (showOnLeaderboard !== undefined) user.showOnLeaderboard = showOnLeaderboard;
    if (leaderboardName !== undefined) user.leaderboardName = leaderboardName;
    await user.save();

    res.json({ msg: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Get all users who want to be shown on the leaderboard
    const users = await User.find({ showOnLeaderboard: true })
      .select('displayName nickname leaderboardName profilePic progress streak')
      .lean();

    // Calculate stats for each user
    const leaderboard = users.map(user => {
      const done = user.progress ? user.progress.filter(p => p.status === 'done').length : 0;
      const total = user.progress ? user.progress.length : 0;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      // Calculate streak: unique days with at least one done task
      const daysDone = new Set((user.progress || []).filter(p => p.status === 'done').map(p => p.day));
      const streak = daysDone.size;
      // Use displayName or nickname based on leaderboardName
      let name = user.displayName;
      if (user.leaderboardName === 'nickname' && user.nickname) {
        name = user.nickname;
      }
      return {
        id: user._id,
        name,
        profilePic: user.profilePic,
        percent,
        streak,
        done,
        total,
      };
    });

    // Sort by percent done, then streak, then name
    leaderboard.sort((a, b) => {
      if (b.percent !== a.percent) return b.percent - a.percent;
      if (b.streak !== a.streak) return b.streak - a.streak;
      return a.name.localeCompare(b.name);
    });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 