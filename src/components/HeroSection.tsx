import React from 'react';
import { Card, Typography, Stack, Box, Chip, Button, Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ProgressChart from './ProgressChart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
// Removed in favor of weekly report under Daily Journal

const HeroSection: React.FC = () => {
  const dailyStreak = useSelector((state: RootState) => state.study.dailyStreak);
  const [heroSrc, setHeroSrc] = React.useState<string | null>(null);
  const [snackOpen, setSnackOpen] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('studyTrackerHeroImage');
    if (saved) setHeroSrc(saved);
  }, []);

  const handlePickImage = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem('studyTrackerHeroImage', dataUrl);
      setHeroSrc(dataUrl);
      setSnackOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleResetHero = () => {
    localStorage.removeItem('studyTrackerHeroImage');
    setHeroSrc(null);
    setSnackOpen(true);
  };

  return (
    <Stack spacing={3}>
      <Card sx={{ p: { xs: 3, md: 4 }, overflow: 'hidden', position: 'relative' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h1" sx={{ mb: 1 }}>
              Selamat Datang!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Siap untuk belajar dengan cara yang seru hari ini?
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <LocalFireDepartmentIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
              <Chip label={`${dailyStreak} Hari Streak`} color="secondary" sx={{ fontWeight: 'bold' }} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button variant="contained">Mulai Belajar</Button>
              <Button variant="outlined">Lihat Hadiah</Button>
              <Button variant="outlined" component="label">
                Ganti Gambar
                <input type="file" accept="image/*,.svg" hidden onChange={(e) => handlePickImage(e.target.files?.[0] || null)} />
              </Button>
              <Button variant="text" onClick={handleResetHero}>Reset</Button>
            </Stack>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <img
              src={heroSrc || new URL('../assets/hero-girl-cute.svg', import.meta.url).toString()}
              alt="Anak perempuan berhijab sedang belajar"
              style={{ width: '100%', maxWidth: 420, borderRadius: 12 }}
            />
          </Box>
        </Stack>
      </Card>

      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Progres Mingguan
        </Typography>
        <ProgressChart />
      </Card>

      <Snackbar open={snackOpen} autoHideDuration={2000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Gambar hero diperbarui!
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default HeroSection;