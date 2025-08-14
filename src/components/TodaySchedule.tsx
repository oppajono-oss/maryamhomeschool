import React from 'react';
import { Card, Typography, Stack, Chip, Box, Divider } from '@mui/material';
import { Subject, WeeklySchedule } from '../types';
import TodayIcon from '@mui/icons-material/Today';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface TodayScheduleProps {
  onSubjectClick: (subject: Subject) => void;
}

const weeklySchedule: WeeklySchedule = {
  Monday: ['Tahfidz', 'Aqidah', 'Matematika', 'Fiqih', 'Geografi', 'Tafsir'],
  Tuesday: ['Tahfidz', 'Sejarah', 'Bhs. Arab', 'Copy Work', 'Science', 'Bhs. Indonesia'],
  Wednesday: ['Tahfidz', 'Geografi', 'Aqidah', 'Matematika', 'Fiqih', 'Adab'],
  Thursday: ['Tahfidz', 'Science', 'Bhs. Arab', 'Copy Work', 'Bhs. Indonesia', 'Sejarah'],
  Friday: ['Tahfidz', 'Matematika', 'Aqidah', 'Geografi', 'Tafsir', 'Fiqih'],
  Saturday: ['Sejarah', 'Adab', 'Bhs. Arab', 'Science', 'Bhs. Indonesia'],
  Sunday: ['Rest']
};

const TodaySchedule: React.FC<TodayScheduleProps> = ({ onSubjectClick }) => {
  // Get current day
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    return days[today.getDay()];
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const currentDay = getCurrentDay();
  const currentDate = getCurrentDate();
  const todaySubjects = weeklySchedule[currentDay] || [];

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <TodayIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h2" gutterBottom sx={{ mb: 0 }}>
          Jadwal Pelajaran Hari Ini
        </Typography>
      </Stack>
      
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <CalendarTodayIcon color="secondary" sx={{ fontSize: 20 }} />
        <Typography variant="body1" color="text.secondary">
          {currentDate}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        {/* Removed English weekday label */}
        
        {todaySubjects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Tidak ada jadwal pelajaran hari ini
            </Typography>
          </Box>
        ) : todaySubjects[0] === 'Rest' ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" color="secondary.main" sx={{ mb: 2 }}>
              🌟 Hari Istirahat 🌟
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Nikmati waktu istirahat Anda!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
              Mata Pelajaran ({todaySubjects.length} pelajaran):
            </Typography>
            
            <Stack spacing={1.5}>
              {todaySubjects.map((subject, index) => (
                <Chip
                  key={index}
                  label={`${index + 1}. ${subject}`}
                  variant="filled"
                  color="primary"
                  size="medium"
                  clickable
                  onClick={() => onSubjectClick(subject as Subject)}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    px: 2,
                    fontSize: '1rem',
                    fontWeight: 'medium',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 2
                    },
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Stack>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="primary.contrastText">
                💡 Klik mata pelajaran untuk langsung memulai timer belajar
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default TodaySchedule;