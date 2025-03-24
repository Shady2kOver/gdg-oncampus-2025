import { configureStore } from '@reduxjs/toolkit';
import documentSlice from './slices/documentSlice';
import pomodoroSlice from './slices/pomodoroSlice';

const store = configureStore({
  reducer: {
    document: documentSlice,
    pomodoro: pomodoroSlice,
  },
});

export default store; 