import React from 'react';
import { 
  Card, 
  Typography, 
  Stack, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useTimer } from '../hooks/useTimer';
import { Subject } from '../types';
import { addCompletedSession } from '../store/studyStore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const subjects: Subject[] = [
  'Tahfidz', 'Aqidah', 'Matematika', 'Fiqih', 'Geografi', 'Tafsir',
  'Sejarah', 'Bhs. Arab', 'Copy Work', 'Science', 'Bhs. Indonesia', 'Adab', 'Other'
];

interface StudyTimerProps {
  selectedSubject?: Subject;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ selectedSubject }) => {
  const dispatch = useDispatch();
  const { timerState, startTimer, stopTimer, resetTimer, setDuration, setSubject, formatTime } = useTimer();

  React.useEffect(() => {
    if (selectedSubject) {
      setSubject(selectedSubject);
    }
  }, [selectedSubject, setSubject]);

  const { minutes, seconds } = formatTime(timerState.timeLeft);

  // Post-session dialog state
  const [postOpen, setPostOpen] = React.useState(false);
  const [sessionNotes, setSessionNotes] = React.useState('');
  const [sessionRating, setSessionRating] = React.useState<number | null>(0);

  React.useEffect(() => {
    const onFinished = () => setPostOpen(true);
    window.addEventListener('timer-finished', onFinished as EventListener);
    return () => window.removeEventListener('timer-finished', onFinished as EventListener);
  }, []);

  const handleSaveSession = () => {
    dispatch(addCompletedSession({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      subject: timerState.currentSubject,
      duration: timerState.duration,
      notes: sessionNotes.trim(),
      rating: sessionRating || 0
    }));
    setPostOpen(false);
    setSessionNotes('');
    setSessionRating(0);
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Timer Belajar
      </Typography>
      
      <Stack spacing={4} alignItems="center">
        {/* Timer Display */}
        <Box
          sx={{
            fontSize: { xs: '3rem', md: '4rem' },
            fontWeight: 'bold',
            color: 'primary.main',
            fontFamily: 'monospace',
            textAlign: 'center'
          }}
        >
          {minutes}:{seconds}
        </Box>

        {/* Timer Controls */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Durasi (menit)"
            type="number"
            value={timerState.duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 25)}
            inputProps={{ min: 1, max: 120 }}
            size="small"
            sx={{ width: 150 }}
          />
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={startTimer}
              disabled={timerState.isRunning}
            >
              Mulai
            </Button>
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={stopTimer}
              disabled={!timerState.isRunning}
            >
              Berhenti
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={resetTimer}
            >
              Reset
            </Button>
          </Stack>
        </Stack>

        {/* Subject Selection */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Mata Pelajaran</InputLabel>
          <Select
            value={timerState.currentSubject}
            label="Mata Pelajaran"
            onChange={(e) => setSubject(e.target.value as Subject)}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Study Log removed as requested */}
      </Stack>

      {/* Post-session dialog */}
      <Dialog open={postOpen} onClose={() => setPostOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Catatan Sesi & Rating</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2">
              Contoh catatan: belajar Bab 3 halaman 7-12
            </Typography>
            <TextField
              label="Catatan"
              multiline
              rows={3}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              fullWidth
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Rating:</Typography>
              <Rating
                name="session-rating"
                value={sessionRating}
                onChange={(_, value) => setSessionRating(value)}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={handleSaveSession} disabled={!sessionNotes.trim() && !sessionRating}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default StudyTimer;