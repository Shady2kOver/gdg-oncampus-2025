import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  timeLeft: 1500, // 25 minutes in seconds
};

export const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setIsRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    resetTimer: (state) => {
      state.timeLeft = 1500;
      state.isRunning = false;
    },
  },
});

export const {
  setIsRunning,
  setTimeLeft,
  decrementTime,
  resetTimer,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer; 