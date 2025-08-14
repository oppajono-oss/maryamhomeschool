import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Stack, 
  Button, 
  TextField, 
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  IconButton
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addJournalEntry } from '../store/studyStore';
import { Mood } from '../types';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import { removeCompletedSession } from '../store/studyStore';
import WeeklyReport from './WeeklyReport';

const moodOptions = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'sad', emoji: '😔', label: 'Sad' }
];

const DailyJournal: React.FC = () => {
  const dispatch = useDispatch();
  const journalEntries = useSelector((state: RootState) => state.study.journalEntries);
  const completedSessions = useSelector((state: RootState) => state.study.completedSessions);
  const [currentMood, setCurrentMood] = useState<Mood>('');
  const [notes, setNotes] = useState('');

  const handleSaveEntry = () => {
    if (!currentMood && !notes.trim()) {
      return;
    }

    dispatch(addJournalEntry({
      mood: currentMood,
      notes: notes.trim()
    }));

    // Reset form
    setCurrentMood('');
    setNotes('');
  };

  const getMoodEmoji = (mood: Mood) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption ? moodOption.emoji : '';
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Daily Journal
      </Typography>
      
      <Stack spacing={3}>
        {/* Journal Entry Form */}
        <Box>
          <Typography variant="h4" gutterBottom>
            How are you feeling?
          </Typography>
          
          <ToggleButtonGroup
            value={currentMood}
            exclusive
            onChange={(_, value) => setCurrentMood(value)}
            sx={{ mb: 3 }}
          >
            {moodOptions.map((mood) => (
              <ToggleButton key={mood.value} value={mood.value} sx={{ px: 3, py: 1 }}>
                <Stack alignItems="center" spacing={0.5}>
                  <Box sx={{ fontSize: '2rem' }}>{mood.emoji}</Box>
                  <Typography variant="caption">{mood.label}</Typography>
                </Stack>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Add your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              size="small"
            >
              Add Photo
            </Button>
            <Button
              variant="outlined"
              startIcon={<MicIcon />}
              size="small"
            >
              Add Voice Note
            </Button>
          </Stack>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveEntry}
            disabled={!currentMood && !notes.trim()}
          >
            Save Entry
          </Button>
        </Box>

        {/* Journal History removed as requested */}

        {/* Laporan Harian dihapus sesuai permintaan */}

        {/* Weekly Report Below Daily Journal */}
        <WeeklyReport />
      </Stack>
    </Card>
  );
};

export default DailyJournal;