import React from 'react';
import { Card, Typography, Grid, Box, Chip, Stack } from '@mui/material';
import { Subject, WeeklySchedule } from '../types';

interface WeeklyPlannerProps {
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

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ onSubjectClick }) => {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Weekly Planner
      </Typography>
      
      <Grid container spacing={2}>
        {Object.entries(weeklySchedule).map(([day, subjects]) => (
          <Grid item xs={12} sm={6} md={4} lg={12/7} key={day}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, height: '100%' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 2, 
                  pb: 1, 
                  borderBottom: 1, 
                  borderColor: 'grey.200',
                  fontSize: '1.1rem'
                }}
              >
                {day}
              </Typography>
              
              <Stack spacing={1}>
                {subjects.map((subject, index) => (
                  <Chip
                    key={index}
                    label={subject}
                    variant={subject === 'Rest' ? 'outlined' : 'filled'}
                    color={subject === 'Rest' ? 'default' : 'primary'}
                    size="small"
                    clickable={subject !== 'Rest'}
                    onClick={() => subject !== 'Rest' && onSubjectClick(subject as Subject)}
                    sx={{
                      justifyContent: 'flex-start',
                      '&:hover': {
                        transform: subject !== 'Rest' ? 'scale(1.02)' : 'none'
                      },
                      transition: 'transform 0.2s ease'
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default WeeklyPlanner;