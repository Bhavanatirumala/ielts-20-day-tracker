import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Container,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { motion } from 'framer-motion';

// Sample IELTS data for tooltips
const TASK_DETAILS = {
  'Intro to IELTS Format': {
    desc: 'Overview of IELTS exam structure and scoring.',
    link: 'https://ielts.org/about-the-test',
    icon: <AutoStoriesIcon color="info" />
  },
  'Listening: Part 1 practice': {
    desc: 'Practice basic information listening (form, note, table).',
    link: 'https://ieltsliz.com/ielts-listening/',
    icon: <LibraryMusicIcon color="primary" />
  },
  'Reading: Skimming & Scanning': {
    desc: 'Learn to quickly find key information in texts.',
    link: 'https://ieltsliz.com/skimming-and-scanning/',
    icon: <MenuBookIcon color="secondary" />
  },
  'Writing Task 1: Types of Graphs': {
    desc: 'Understand bar, line, pie, and table graphs.',
    link: 'https://ieltsliz.com/ielts-writing-task-1-lessons-and-tips/',
    icon: <EditNoteIcon color="success" />
  },
  'Vocabulary: 10 words (Education)': {
    desc: 'Learn 10 essential education-related words.',
    link: 'https://ieltsliz.com/ielts-vocabulary/',
    icon: <AutoStoriesIcon color="info" />
  },
  'Listening: Part 2 practice': {
    desc: 'Practice listening for main ideas and details.',
    link: 'https://ieltsliz.com/ielts-listening/',
    icon: <LibraryMusicIcon color="primary" />
  },
  'Reading: True/False/Not Given': {
    desc: 'Master the True/False/Not Given question type.',
    link: 'https://ieltsliz.com/true-false-not-given/',
    icon: <MenuBookIcon color="secondary" />
  },
  'Writing Task 2: Essay introductions': {
    desc: 'Learn to write strong essay introductions.',
    link: 'https://ieltsliz.com/ielts-writing-task-2/',
    icon: <EditNoteIcon color="success" />
  },
  'Speaking: Introduction questions': {
    desc: 'Practice common Part 1 speaking questions.',
    link: 'https://ieltsliz.com/ielts-speaking-free-lessons-essential-tips/',
    icon: <RecordVoiceOverIcon color="warning" />
  },
  'Vocabulary: 10 words (Technology)': {
    desc: 'Learn 10 essential technology-related words.',
    link: 'https://ieltsliz.com/ielts-vocabulary/',
    icon: <AutoStoriesIcon color="info" />
  },
  // ... (add more for other tasks as needed)
};

const getTaskDetails = (task) => TASK_DETAILS[task] || {
  desc: 'Practice and master this task.',
  link: '',
  icon: <AutoStoriesIcon color="disabled" />
};

const DayViewPage = () => {
  const { day } = useParams();
  const [dayData, setDayData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [notes, setNotes] = useState('');
  const [initialNotes, setInitialNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const theme = useTheme();

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'x-auth-token': token,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleRes = await axios.get('/api/schedule');
        const dayInfo = scheduleRes.data.find(d => d.day === parseInt(day));
        setDayData(dayInfo);
        
        const progressRes = await axios.get('/api/progress', config);
        setProgress(progressRes.data);

        const notesRes = await axios.get('/api/notes', config);
        const dayNote = notesRes.data.find(n => n.day === parseInt(day));
        if (dayNote) {
            setNotes(dayNote.content);
            setInitialNotes(dayNote.content);
        } else {
            setNotes('');
            setInitialNotes('');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [day]);

  const handleStatusChange = async (task, status) => {
    try {
        const newProgress = [...progress];
        const taskIndex = newProgress.findIndex(p => p.day === parseInt(day) && p.task === task);
        if (taskIndex > -1) {
            newProgress[taskIndex].status = status;
            setProgress(newProgress);
            await axios.post('/api/progress', { day: parseInt(day), task, status }, config);
        }
    } catch (err) {
        console.error(err);
    }
  };
  
  const handleNoteChange = (e) => {
    setNotes(e.target.value);
  };

  const handleNoteSave = async () => {
    setSaving(true);
    try {
        await axios.post('/api/notes', { day: parseInt(day), content: notes }, config);
        setInitialNotes(notes);
        setSaving(false);
    } catch (err) {
        setSaving(false);
        console.error(err);
        alert('Failed to save note.');
    }
  };

  if (!dayData) {
    return <div>Loading...</div>;
  }

  const getTaskStatus = (task) => {
    const found = progress.find(p => p.day === parseInt(day) && p.task === task);
    return found ? found.status : 'pending';
  };

  // Check if all tasks for the day are done
  const allDone = dayData.tasks.every(task => getTaskStatus(task) === 'done');

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      <AppBar position="static" color="primary" elevation={2} component={motion.div} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Toolbar>
          <Button component={Link} to="/dashboard" color="inherit" startIcon={<ArrowBackIcon />}>
            Back
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Day {day} Tasks
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {allDone && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <CelebrationIcon color="success" sx={{ fontSize: 60, mb: 1 }} component={motion.div} initial={{ scale: 0.7, rotate: -10 }} animate={{ scale: 1.1, rotate: 10 }} transition={{ yoyo: Infinity, duration: 0.7 }} />
              <Typography variant="h5" color="success.main" fontWeight={700}>
                Congratulations! All tasks for Day {day} are complete! 🎉
              </Typography>
            </Box>
          )}
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Paper elevation={4} sx={{ p: 3, borderRadius: 4, background: theme.palette.background.paper }} component={motion.div} whileHover={{ scale: 1.01, boxShadow: `0 8px 32px ${theme.palette.primary.main}1A` }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  Tasks for Day {day}
                </Typography>
                <Box>
                  {dayData.tasks.map(task => {
                    const details = getTaskDetails(task);
                    return (
                      <Tooltip key={task} title={<Box>
                        <Typography variant="subtitle2" color="text.primary">{details.desc}</Typography>
                        {details.link && <a href={details.link} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>Learn more</a>}
                      </Box>} arrow placement="right">
                        <Card sx={{ mb: 2, borderRadius: 3, background: getTaskStatus(task) === 'done' ? theme.palette.success.light : theme.palette.background.paper, transition: 'background 0.3s' }} component={motion.div} whileHover={{ scale: 1.03, boxShadow: `0 8px 32px ${theme.palette.primary.main}1A` }}>
                          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            {details.icon}
                            <FormControlLabel
                              sx={{ flex: 1, ml: 1 }}
                              control={
                                <Checkbox
                                  checked={getTaskStatus(task) === 'done'}
                                  onChange={(e) => handleStatusChange(task, e.target.checked ? 'done' : 'pending')}
                                  color="success"
                                />
                              }
                              label={<Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>{task}</Typography>}
                            />
                          </CardContent>
                        </Card>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={4} sx={{ p: 3, borderRadius: 4, background: theme.palette.background.paper }} component={motion.div} whileHover={{ scale: 1.01, boxShadow: `0 8px 32px ${theme.palette.secondary.main}1A` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NoteAltIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="secondary">
                    Your Notes
                  </Typography>
                </Box>
                <TextField
                  value={notes}
                  onChange={handleNoteChange}
                  multiline
                  minRows={6}
                  fullWidth
                  placeholder="Add your notes for the day here..."
                  variant="outlined"
                  sx={{ mb: 2, background: theme.palette.background.paper, color: theme.palette.text.primary }}
                  InputProps={{ style: { color: theme.palette.text.primary } }}
                />
                <Button
                  onClick={handleNoteSave}
                  variant="contained"
                  color="secondary"
                  disabled={notes === initialNotes || saving}
                  fullWidth
                  size="large"
                >
                  {saving ? 'Saving...' : 'Save Note'}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DayViewPage; 