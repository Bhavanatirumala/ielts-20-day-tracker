const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  task: { type: String, required: true },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' }
});

const noteSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  content: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: { type: String, default: '' },
  nickname: { type: String, default: '' },
  mobile: { type: String, default: '' },
  dob: { type: Date },
  profilePic: { type: String, default: '' },
  progress: [progressSchema],
  notes: [noteSchema],
  showOnLeaderboard: { type: Boolean, default: true },
  leaderboardName: { type: String, enum: ['displayName', 'nickname'], default: 'displayName' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // posts and comments will be added later for discussion board
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 