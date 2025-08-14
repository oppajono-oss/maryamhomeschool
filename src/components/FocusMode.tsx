import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  Stack, 
  Button, 
  TextField, 
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTimer } from '../hooks/useTimer';
import { Subject } from '../types';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface FocusModeProps {
  open: boolean;
  onClose: () => void;
}

const subjects: Subject[] = [
  'Tahfidz', 'Aqidah', 'Matematika', 'Fiqih', 'Geografi', 'Tafsir',
  'Sejarah', 'Bhs. Arab', 'Copy Work', 'Science', 'Bhs. Indonesia', 'Adab', 'Other'
];

const FocusMode: React.FC<FocusModeProps> = ({ open, onClose }) => {
  const { timerState, startTimer, stopTimer, resetTimer, setDuration, setSubject, formatTime } = useTimer();
  const { minutes, seconds } = formatTime(timerState.timeLeft);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', maxWidth: 600, width: '100%' }}>
        <Stack spacing={6} alignItems="center">
          <Typography variant="h3" color="primary" gutterBottom>
            Focus Mode
          </Typography>

          {/* Large Timer Display */}
          <Box
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 'bold',
              color: 'primary.main',
              fontFamily: 'monospace',
              textAlign: 'center',
              p: 4,
              border: 3,
              borderColor: 'primary.main',
              borderRadius: 4,
              minWidth: 300
            }}
          >
            {minutes}:{seconds}
          </Box>

          {/* Simple Controls */}
          <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Minutes"
                type="number"
                value={timerState.duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 25)}
                inputProps={{ min: 1, max: 120 }}
                size="large"
                sx={{ width: 120 }}
              />
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={timerState.currentSubject}
                  label="Subject"
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  size="large"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={startTimer}
                disabled={timerState.isRunning}
                sx={{ px: 4, py: 2, fontSize: '1.2rem' }}
              >
                Start
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<StopIcon />}
                onClick={stopTimer}
                disabled={!timerState.isRunning}
                sx={{ px: 4, py: 2, fontSize: '1.2rem' }}
              >
                Stop
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RestartAltIcon />}
                onClick={resetTimer}
                sx={{ px: 4, py: 2, fontSize: '1.2rem' }}
              >
                Reset
              </Button>
            </Stack>

            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<ExitToAppIcon />}
              onClick={onClose}
              sx={{ px: 4, py: 2, fontSize: '1.2rem', mt: 4 }}
            >
              Exit Focus Mode
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default FocusMode;