import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudyData, StudyLogEntry, JournalEntry, Reward, Subject, CompletedSession } from '../types';

const STORAGE_KEYS = {
  JOURNAL: 'studyTrackerJournal',
  STREAK: 'studyTrackerStreak',
  LAST_STUDY_DATE: 'studyTrackerLastStudyDate',
  STUDY_LOG: 'studyTrackerStudyLog',
  REWARDS: 'studyTrackerRewards'
};

const initialRewards: Reward[] = [
  { id: '1', name: 'First Study Session', icon: '⭐', earned: false },
  { id: '2', name: '3-Day Streak', icon: '🔥', earned: false },
  { id: '3', name: '10 Hours Studied', icon: '📚', earned: false },
  { id: '4', name: '5 Study Sessions', icon: '🚀', earned: false },
  { id: '5', name: 'Completed a Subject', icon: '🏆', earned: false }
];

const loadFromStorage = (): StudyData => {
  try {
    const studyLog = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_LOG) || '[]');
    const journal = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
    const rewards = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARDS) || JSON.stringify(initialRewards));
    const streak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '0');
    const lastStudyDate = localStorage.getItem(STORAGE_KEYS.LAST_STUDY_DATE);
    const completedSessions: CompletedSession[] = JSON.parse(localStorage.getItem('studyTrackerCompletedSessions') || '[]');

    return {
      studyLogEntries: studyLog,
      journalEntries: journal,
      rewards,
      dailyStreak: streak,
      lastStudyDate,
      completedSessions
    };
  } catch {
    return {
      studyLogEntries: [],
      journalEntries: [],
      rewards: initialRewards,
      dailyStreak: 0,
      lastStudyDate: null,
      completedSessions: []
    };
  }
};

const initialState: StudyData = loadFromStorage();

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    addStudyLogEntry: (state, action: PayloadAction<{ subject: Subject; duration: number }>) => {
      const entry: StudyLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        subject: action.payload.subject,
        duration: action.payload.duration
      };
      state.studyLogEntries.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.STUDY_LOG, JSON.stringify(state.studyLogEntries));
      
      // Update streak
      const today = new Date().toDateString();
      if (state.lastStudyDate !== today) {
        const lastDate = state.lastStudyDate ? new Date(state.lastStudyDate) : null;
        const todayDate = new Date(today);
        
        if (lastDate && (todayDate.getTime() - lastDate.getTime() === 24 * 60 * 60 * 1000)) {
          state.dailyStreak++;
        } else {
          state.dailyStreak = 1;
        }
        state.lastStudyDate = today;
        localStorage.setItem(STORAGE_KEYS.STREAK, state.dailyStreak.toString());
        localStorage.setItem(STORAGE_KEYS.LAST_STUDY_DATE, state.lastStudyDate);
      }
      
      // Check for rewards
      studySlice.caseReducers.checkRewards(state);
      try { (require('../services/cloud') as any).pushState(state); } catch {}
    },
    
    addJournalEntry: (state, action: PayloadAction<{ mood: string; notes: string }>) => {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        mood: action.payload.mood as any,
        notes: action.payload.notes
      };
      state.journalEntries.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(state.journalEntries));
      try { (require('../services/cloud') as any).pushState(state); } catch {}
    },
    
    checkRewards: (state) => {
      const totalHours = state.studyLogEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
      const totalSessions = state.studyLogEntries.length;
      const uniqueSubjects = new Set(state.studyLogEntries.map(entry => entry.subject)).size;
      
      state.rewards.forEach(reward => {
        if (!reward.earned) {
          let shouldEarn = false;
          
          switch (reward.name) {
            case 'First Study Session':
              shouldEarn = totalSessions >= 1;
              break;
            case '3-Day Streak':
              shouldEarn = state.dailyStreak >= 3;
              break;
            case '10 Hours Studied':
              shouldEarn = totalHours >= 10;
              break;
            case '5 Study Sessions':
              shouldEarn = totalSessions >= 5;
              break;
            case 'Completed a Subject':
              shouldEarn = uniqueSubjects > 0;
              break;
          }
          
          if (shouldEarn) {
            reward.earned = true;
            reward.earnedDate = new Date().toLocaleDateString();
          }
        }
      });
      
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(state.rewards));
    },

    addCompletedSession: (state, action: PayloadAction<CompletedSession>) => {
      state.completedSessions.unshift(action.payload);
      localStorage.setItem('studyTrackerCompletedSessions', JSON.stringify(state.completedSessions));
      try { (require('../services/cloud') as any).pushState(state); } catch {}
    },

    removeCompletedSession: (state, action: PayloadAction<string>) => {
      state.completedSessions = state.completedSessions.filter(s => s.id !== action.payload);
      localStorage.setItem('studyTrackerCompletedSessions', JSON.stringify(state.completedSessions));
      try { (require('../services/cloud') as any).pushState(state); } catch {}
    },

    seedDemoWeek: (state) => {
      const subjects: Subject[] = ['Tahfidz', 'Aqidah', 'Matematika', 'Fiqih', 'Geografi', 'Tafsir', 'Sejarah', 'Bhs. Arab', 'Copy Work', 'Science', 'Bhs. Indonesia', 'Adab', 'Other'];
      const moods: Array<{ mood: string; note: string }> = [
        { mood: 'happy', note: 'aku hari ini semangat belajar' },
        { mood: 'neutral', note: 'belajar biasa saja' },
        { mood: 'happy', note: 'materinya seru' },
        { mood: 'sad', note: 'sedikit lelah tapi tetap belajar' },
        { mood: 'happy', note: 'sangat antusias' },
        { mood: 'neutral', note: 'cukup fokus' },
        { mood: 'happy', note: 'semua tugas selesai' }
      ];

      const today = new Date();

      const newStudyLogs: StudyLogEntry[] = [];
      const newCompleted: CompletedSession[] = [];
      const newJournals: JournalEntry[] = [];

      for (let i = 6; i >= 0; i--) {
        const base = new Date(today);
        base.setDate(today.getDate() - i);

        // Journal for the day
        const mood = moods[6 - i];
        newJournals.unshift({
          id: `${base.getTime()}-journal`,
          timestamp: base.toLocaleString(),
          mood: mood.mood as any,
          notes: mood.note
        });

        // 2-3 sessions per day
        const sessionsCount = 2 + Math.floor(Math.random() * 2);
        for (let s = 0; s < sessionsCount; s++) {
          const subject = subjects[(i + s * 3) % subjects.length];
          const duration = [15, 20, 25, 30][(i + s) % 4];
          const rating = 3 + ((i + s) % 3); // 3-5
          const notes = `Belajar ${subject} bab ${(i + 1)} halaman ${(s + 1) * 5}-${(s + 2) * 5}`;

          const time = new Date(base);
          time.setHours(9 + s * 2, 0, 0, 0);

          const timestamp = time.toLocaleString();
          const id = `${time.getTime()}-${subject}`;

          newStudyLogs.unshift({ id, timestamp, subject, duration });
          newCompleted.unshift({ id: `${id}-c`, timestamp, subject, duration, rating, notes });
        }
      }

      state.studyLogEntries = newStudyLogs;
      state.completedSessions = newCompleted;
      state.journalEntries = newJournals;
      state.dailyStreak = 7;
      state.lastStudyDate = today.toDateString();

      localStorage.setItem(STORAGE_KEYS.STUDY_LOG, JSON.stringify(state.studyLogEntries));
      localStorage.setItem('studyTrackerCompletedSessions', JSON.stringify(state.completedSessions));
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(state.journalEntries));
      localStorage.setItem(STORAGE_KEYS.STREAK, state.dailyStreak.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_STUDY_DATE, state.lastStudyDate);

      // Update rewards
      studySlice.caseReducers.checkRewards(state);
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(state.rewards));
    },

    resetAllData: (state) => {
      state.studyLogEntries = [];
      state.completedSessions = [];
      state.journalEntries = [];
      state.dailyStreak = 0;
      state.lastStudyDate = null;
      // keep rewards structure but mark as not earned
      state.rewards.forEach(r => { r.earned = false; r.earnedDate = undefined; });
      localStorage.removeItem(STORAGE_KEYS.STUDY_LOG);
      localStorage.removeItem('studyTrackerCompletedSessions');
      localStorage.removeItem(STORAGE_KEYS.JOURNAL);
      localStorage.removeItem(STORAGE_KEYS.STREAK);
      localStorage.removeItem(STORAGE_KEYS.LAST_STUDY_DATE);
      localStorage.removeItem(STORAGE_KEYS.REWARDS);
      localStorage.removeItem('studyTrackerDemoSeeded');
    }
  }
});

export const { addStudyLogEntry, addJournalEntry, checkRewards, addCompletedSession, removeCompletedSession, seedDemoWeek, resetAllData } = studySlice.actions;
export default studySlice.reducer;