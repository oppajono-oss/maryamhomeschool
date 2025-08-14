import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addStudyLogEntry } from '../store/studyStore';
import { Subject, TimerState } from '../types';

export const useTimer = () => {
  const dispatch = useDispatch();
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeLeft: 0,
    duration: 25,
    currentSubject: 'Other'
  });

  const startTimer = useCallback(() => {
    if (timerState.isRunning) return;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      timeLeft: prev.duration * 60
    }));
  }, [timerState.isRunning, timerState.duration]);

  const stopTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.duration * 60
    }));
  }, [timerState.duration]);

  const setDuration = useCallback((duration: number) => {
    setTimerState(prev => ({
      ...prev,
      duration,
      timeLeft: prev.isRunning ? prev.timeLeft : duration * 60
    }));
  }, []);

  const setSubject = useCallback((subject: Subject) => {
    setTimerState(prev => ({
      ...prev,
      currentSubject: subject
    }));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timerState.isRunning && timerState.timeLeft === 0) {
      // Timer finished
      setTimerState(prev => ({
        ...prev,
        isRunning: false
      }));
      
      // Log the study session
      dispatch(addStudyLogEntry({
        subject: timerState.currentSubject,
        duration: timerState.duration
      }));
      // Emit a custom event so UI can open post-session dialog
      window.dispatchEvent(new CustomEvent('timer-finished'));
    }

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.timeLeft, timerState.currentSubject, timerState.duration, dispatch]);

  const formatTime = useCallback((timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }, []);

  return {
    timerState,
    startTimer,
    stopTimer,
    resetTimer,
    setDuration,
    setSubject,
    formatTime
  };
};