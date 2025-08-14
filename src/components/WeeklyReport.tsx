import React from 'react';
import { Card, Typography, Stack, Box, Divider, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const dayLabelsId = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

const WeeklyReport: React.FC = () => {
  const completed = useSelector((s: RootState) => s.study.completedSessions);
  const journals = useSelector((s: RootState) => s.study.journalEntries);

  // group sessions by day (last 7 days)
  const today = new Date();
  const days: Array<{ key: string; label: string; items: typeof completed } > = [] as any;

  for (let i = 0; i <= 6; i++) { // newest first in the array we will reverse later
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toDateString();
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const items = completed.filter(s => new Date(s.timestamp).toDateString() === key);
    days.push({ key, label, items });
  }
  // sort newest to oldest
  days.sort((a, b) => new Date(b.key).getTime() - new Date(a.key).getTime());

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Laporan Mingguan
      </Typography>
      <Stack spacing={2} sx={{ maxHeight: 420, overflow: 'auto', pr: 1 }}>
        {days.map((day, idx) => (
          <Box key={day.key}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>{day.label}</Typography>
            {/* Mood + catatan dari jurnal */}
            {(() => {
              const je = journals.find(j => new Date(j.timestamp).toDateString() === day.key);
              const moodEmoji = je?.mood === 'happy' ? '😊' : je?.mood === 'neutral' ? '😐' : je?.mood === 'sad' ? '😔' : '🙂';
              return (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5, mb: 0.5 }}>
                  <Chip label={moodEmoji} size="small" />
                  <Typography variant="body2" color="text.secondary">{je?.notes || '—'}</Typography>
                </Stack>
              );
            })()}
            {day.items.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Belum ada sesi.</Typography>
            ) : (
              <Stack spacing={1} sx={{ mt: 1 }}>
                {day.items.map((s) => (
                  <Box key={s.id} sx={{ p: 1.25, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.subject} ({s.duration} menit)</Typography>
                    {s.notes && <Typography variant="body2" color="text.secondary">{s.notes}</Typography>}
                  </Box>
                ))}
              </Stack>
            )}
            {idx < days.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

export default WeeklyReport;


