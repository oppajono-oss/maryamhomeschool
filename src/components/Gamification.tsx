import React from 'react';
import { Card, Typography, Grid, Box, Chip, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Gamification: React.FC = () => {
  const rewards = useSelector((state: RootState) => state.study.rewards);

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Lencana & Hadiah
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Naik level dengan menyelesaikan sesi belajar. Dapatkan lencana seperti permainan!
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {rewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                bgcolor: reward.earned ? 'primary.light' : 'grey.100',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                opacity: reward.earned ? 1 : 0.6,
                transform: reward.earned ? 'scale(1)' : 'scale(0.95)',
                border: '2px solid',
                borderColor: reward.earned ? 'primary.main' : 'grey.300',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <Box sx={{ fontSize: '3rem', mb: 1 }}>{reward.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {reward.name}
              </Typography>
              <Stack direction="row" justifyContent="center">
                <Chip
                  label={reward.earned ? 'Diperoleh!' : 'Terkunci'}
                  color={reward.earned ? 'success' : 'default'}
                  size="small"
                  variant={reward.earned ? 'filled' : 'outlined'}
                />
              </Stack>
              {reward.earned && reward.earnedDate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Tanggal: {reward.earnedDate}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default Gamification;