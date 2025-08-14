import { configureStore } from '@reduxjs/toolkit';
import studyReducer from './studyStore';

export const store = configureStore({
  reducer: {
    study: studyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;