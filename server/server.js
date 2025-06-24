const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./api/routes/authRoutes'));
app.use('/api', require('./api/routes/scheduleRoutes'));
app.use('/api', require('./api/routes/progressRoutes'));
app.use('/api', require('./api/routes/notesRoutes'));
app.use('/api', require('./api/routes/profileRoutes'));
app.use('/api/discussion', require('./api/routes/discussionRoutes'));

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 