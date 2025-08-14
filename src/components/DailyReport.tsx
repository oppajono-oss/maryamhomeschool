import React from 'react';
import { Card, Typography, Stack, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const DailyReport: React.FC = () => {
  const completedSessions = useSelector((state: RootState) => state.study.completedSessions);
  const journalEntries = useSelector((state: RootState) => state.study.journalEntries);

  const today = new Date();
  const formattedDate = today
    .toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    .replace(',', '');

  const todayJournal = React.useMemo(() => {
    const todayStr = today.toDateString();
    return journalEntries.find(e => new Date(e.timestamp).toDateString() === todayStr);
  }, [journalEntries]);

  const moodText = (() => {
    switch (todayJournal?.mood) {
      case 'happy': return 'senang';
      case 'neutral': return 'netral';
      case 'sad': return 'sedih';
      default: return '';
    }
  })();

  const todaySessions = React.useMemo(() => {
    const todayStr = today.toDateString();
    return completedSessions.filter(s => new Date(s.timestamp).toDateString() === todayStr);
  }, [completedSessions]);

  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Stack spacing={1}>
        <Typography variant="h4">{formattedDate}</Typography>
        <Typography variant="body2">
          <strong>Mood:</strong> {moodText}{todayJournal?.notes ? ` ${todayJournal.notes}` : ''}
        </Typography>
        <Box>
          <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>Catatan per Pelajaran</Typography>
          <List sx={{ bgcolor: 'grey.50', borderRadius: 1, maxHeight: 260, overflow: 'auto' }}>
            {todaySessions.length === 0 ? (
              <ListItem>
                <ListItemText primary="Belum ada sesi belajar hari ini." />
              </ListItem>
            ) : (
              todaySessions.map((s, index) => (
                <React.Fragment key={s.id}>
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {s.subject} ({s.duration} min)
                    </Typography>
                    {s.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {s.notes}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Rating: {Array.from({ length: 5 }, (_, i) => (i < s.rating ? '⭐' : '☆')).join('')}
                    </Typography>
                  </ListItem>
                  {index < todaySessions.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Box>
      </Stack>
    </Card>
  );
};

export default DailyReport;


