import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setIsRunning,
  decrementTime,
  resetTimer,
} from '../store/slices/pomodoroSlice';

function Pomodoro() {
  const dispatch = useDispatch();
  const { isRunning, timeLeft } = useSelector((state) => state.pomodoro);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
    } else if (timeLeft === 0) {
      dispatch(setIsRunning(false));
      // Play notification sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, dispatch]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStart = () => {
    dispatch(setIsRunning(true));
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto text-center">
      <h2 className="text-2xl font-semibold text-primary mb-6">Pomodoro Timer</h2>
      <div className="text-7xl font-bold text-primary mb-8 font-montserrat tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="btn-primary"
        >
          {isRunning ? 'Running...' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="btn-secondary"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Pomodoro; 