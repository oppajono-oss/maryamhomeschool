import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';

interface ParentViewProps {
  open: boolean;
  onClose: () => void;
}

const ParentView: React.FC<ParentViewProps> = ({ open, onClose }) => {
  const { studyLogEntries, journalEntries, rewards, dailyStreak } = useSelector((state: RootState) => state.study);

  const totalStudyHours = studyLogEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
  const totalSessions = studyLogEntries.length;
  const earnedRewards = rewards.filter(reward => reward.earned);
  const subjectStats = studyLogEntries.reduce((acc, entry) => {
    acc[entry.subject] = (acc[entry.subject] || 0) + entry.duration;
    return acc;
  }, {} as Record<string, number>);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" component="div">
          Parent Progress Report
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Summary Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Study Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {Math.round(totalStudyHours * 10) / 10}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Hours
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {totalSessions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Study Sessions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="secondary.main">
                        {dailyStreak}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Day Streak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {earnedRewards.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Achievements
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Subject Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Subject Time Distribution
                </Typography>
                <List dense>
                  {Object.entries(subjectStats)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([subject, minutes]) => (
                      <ListItem key={subject} sx={{ px: 0 }}>
                        <ListItemText
                          primary={subject}
                          secondary={`${Math.round(minutes / 6) / 10} hours`}
                        />
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Achievements */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Recent Achievements
                </Typography>
                <List dense>
                  {earnedRewards.slice(0, 5).map((reward) => (
                    <ListItem key={reward.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{reward.icon}</span>
                            <span>{reward.name}</span>
                          </Box>
                        }
                        secondary={reward.earnedDate}
                      />
                    </ListItem>
                  ))}
                  {earnedRewards.length === 0 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText primary="No achievements yet" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Journal Entries */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Recent Journal Entries
                </Typography>
                <List>
                  {journalEntries.slice(0, 3).map((entry, index) => (
                    <React.Fragment key={entry.id}>
                      <ListItem sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {entry.timestamp} {entry.mood && `• ${entry.mood === 'happy' ? '😊' : entry.mood === 'neutral' ? '😐' : '😔'}`}
                        </Typography>
                        {entry.notes && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {entry.notes.length > 100 ? `${entry.notes.substring(0, 100)}...` : entry.notes}
                          </Typography>
                        )}
                      </ListItem>
                      {index < Math.min(journalEntries.length - 1, 2) && <Divider />}
                    </React.Fragment>
                  ))}
                  {journalEntries.length === 0 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText primary="No journal entries yet" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handlePrint} startIcon={<PrintIcon />}>
          Print Report
        </Button>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentView;