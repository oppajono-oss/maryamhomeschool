import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Button } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import TodaySchedule from './components/TodaySchedule';
import StudyTimer from './components/StudyTimer';
import DailyJournal from './components/DailyJournal';
import Gamification from './components/Gamification';
import ParentView from './components/ParentView';
import FocusMode from './components/FocusMode';
import { Subject } from './types';
import { useDispatch } from 'react-redux';
import { seedDemoWeek } from './store/studyStore';
import { initCloud, pullState, subscribeToRemote, setPushSuspended } from './services/cloud';
import { useSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { RootState } from './store';
import { addCompletedSession, addJournalEntry, addStudyLogEntry } from './store/studyStore';

const StudyTracker: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [parentViewOpen, setParentViewOpen] = useState(false);
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const dispatch = useDispatch();
  const storeState = useSelector((s: RootState) => s.study);
  React.useEffect(() => {
    (async () => {
      try {
        await initCloud();
        const remote = await pullState();
        if (remote) {
          // simple replace: suspend push to avoid echo
          setPushSuspended(true);
          localStorage.setItem('studyTrackerStudyLog', JSON.stringify(remote.studyLogEntries || []));
          localStorage.setItem('studyTrackerCompletedSessions', JSON.stringify(remote.completedSessions || []));
          localStorage.setItem('studyTrackerJournal', JSON.stringify(remote.journalEntries || []));
          localStorage.setItem('studyTrackerStreak', String(remote.dailyStreak || 0));
          localStorage.setItem('studyTrackerLastStudyDate', remote.lastStudyDate || '');
          setTimeout(() => setPushSuspended(false), 1500);
        }
        subscribeToRemote((remoteData) => {
          // Optional: handle realtime incoming updates if needed later
        });
      } catch {}
    })();
  }, []);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentSection('timer');
    // Scroll to timer section
    setTimeout(() => {
      const element = document.getElementById('timer');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return <HeroSection />;
      case 'planner':
        return <TodaySchedule onSubjectClick={handleSubjectClick} />;
      case 'timer':
        return <StudyTimer selectedSubject={selectedSubject} />;
      case 'journal':
        return <DailyJournal />;
      case 'rewards':
        return <Gamification />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
            onParentViewOpen={() => setParentViewOpen(true)}
            onFocusModeOpen={() => setFocusModeOpen(true)}
          />

          <Container 
            maxWidth="lg" 
            sx={{ 
              flex: 1, 
              py: 3, 
              pb: 10, // Space for bottom navigation
              px: { xs: 2, sm: 3 }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button size="small" variant="outlined" onClick={() => dispatch(seedDemoWeek())}>Isi Data Demo 7 Hari</Button>
            </Box>
            {/* All sections for scrolling navigation */}
            <Box id="home" sx={{ mb: 4 }}>
              <HeroSection />
            </Box>

            <Box id="planner" sx={{ mb: 4 }}>
              <TodaySchedule onSubjectClick={handleSubjectClick} />
            </Box>

            <Box id="timer" sx={{ mb: 4 }}>
              <StudyTimer selectedSubject={selectedSubject} />
            </Box>

            <Box id="journal" sx={{ mb: 4 }}>
              <DailyJournal />
            </Box>

            <Box id="rewards" sx={{ mb: 4 }}>
              <Gamification />
            </Box>
          </Container>

          <ParentView
            open={parentViewOpen}
            onClose={() => setParentViewOpen(false)}
          />

          <FocusMode
            open={focusModeOpen}
            onClose={() => setFocusModeOpen(false)}
          />
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default StudyTracker;