import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Container,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { motion } from 'framer-motion';

const resources = {
    Listening: [
      { name: 'IELTS Liz - Listening', url: 'https://ieltsliz.com/ielts-listening/' },
      { name: 'British Council - Listening', url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/listening' },
      { name: 'IELTS Online Tests', url: 'https://ieltsonlinetests.com/ielts-listening-practice-tests' }
    ],
    Reading: [
        { name: 'IELTS Liz - Reading', url: 'https://ieltsliz.com/ielts-reading-lessons-information-and-tips/' },
        { name: 'British Council - Reading', url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/reading' },
        { name: 'Magoosh - IELTS Reading', url: 'https://magoosh.com/ielts/ielts-reading-practice-test/' }
    ],
    Writing: [
        { name: 'IELTS Liz - Writing Task 1', url: 'https://ieltsliz.com/ielts-writing-task-1-lessons-and-tips/' },
        { name: 'IELTS Liz - Writing Task 2', url: 'https://ieltsliz.com/ielts-writing-task-2/' },
        { name: 'IELTS Simon', url: 'https://ielts-simon.com/' }
    ],
    Speaking: [
        { name: 'IELTS Liz - Speaking', url: 'https://ieltsliz.com/ielts-speaking-free-lessons-essential-tips/' },
        { name: 'IELTS Speaking Practice', url: 'https://www.ielts.org/about-the-test/test-format/speaking-test' },
        { name: 'Magoosh - IELTS Speaking', url: 'https://magoosh.com/ielts/ielts-speaking-topics/' }
    ],
    Vocabulary: [
        { name: 'IELTS Liz - Vocabulary', url: 'https://ieltsliz.com/ielts-vocabulary/' },
        { name: 'Magoosh - IELTS Vocabulary Flashcards', url: 'https://ielts.magoosh.com/flashcards/vocabulary' },
        { name: 'Vocabulary for IELTS - British Council', url: 'https://learnenglish.britishcouncil.org/vocabulary' }
    ]
};

const icons = {
  Listening: <LibraryMusicIcon color="primary" sx={{ fontSize: 40 }} />,
  Reading: <MenuBookIcon color="secondary" sx={{ fontSize: 40 }} />,
  Writing: <EditNoteIcon color="success" sx={{ fontSize: 40 }} />,
  Speaking: <RecordVoiceOverIcon color="warning" sx={{ fontSize: 40 }} />,
  Vocabulary: <AutoStoriesIcon color="info" sx={{ fontSize: 40 }} />,
};

const ResourcesPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #fff 100%)' }}>
      <AppBar position="static" color="primary" elevation={2} component={motion.div} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Toolbar>
          <Button component={Link} to="/dashboard" color="inherit" startIcon={<ArrowBackIcon />}>
            Back
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Helpful Resources
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Grid container spacing={4}>
            {Object.entries(resources).map(([category, links], idx) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card elevation={4} sx={{ borderRadius: 4, background: '#fff', minHeight: 220 }} component={motion.div} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {icons[category]}
                      <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }} color="primary">
                        {category}
                      </Typography>
                    </Box>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {links.map(link => (
                        <li key={link.name} style={{ marginBottom: 8 }}>
                          <Button
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ textTransform: 'none', fontWeight: 500 }}
                          >
                            {link.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ResourcesPage; 