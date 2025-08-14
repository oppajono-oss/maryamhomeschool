export interface StudyLogEntry {
  id: string;
  timestamp: string;
  subject: string;
  duration: number; // in minutes
}

export interface CompletedSession {
  id: string;
  timestamp: string;
  subject: Subject;
  duration: number; // in minutes
  notes: string;
  rating: number; // 1-5
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  mood: 'happy' | 'neutral' | 'sad' | '';
  notes: string;
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface StudyData {
  dailyStreak: number;
  lastStudyDate: string | null;
  studyLogEntries: StudyLogEntry[];
  journalEntries: JournalEntry[];
  rewards: Reward[];
  completedSessions: CompletedSession[];
}

export type Subject = 
  | 'Tahfidz'
  | 'Aqidah' 
  | 'Matematika'
  | 'Fiqih'
  | 'Geografi'
  | 'Tafsir'
  | 'Sejarah'
  | 'Bhs. Arab'
  | 'Copy Work'
  | 'Science'
  | 'Bhs. Indonesia'
  | 'Adab'
  | 'Other';

export interface WeeklySchedule {
  [key: string]: Subject[];
}

export type Mood = 'happy' | 'neutral' | 'sad' | '';

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  duration: number;
  currentSubject: Subject;
}