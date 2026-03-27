import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer(initialMinutes = 1, initialSeconds = 0) {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(initialMinutes * 60 + initialSeconds);
  const intervalRef = useRef();

  const format = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const start = useCallback((minutes, seconds) => {
    if (running) {
      setPaused(p => !p);
    } else {
      const total = minutes * 60 + seconds;
      if (total <= 0) return;
      setRemaining(total);
      setRunning(true);
      setPaused(false);
    }
  }, [running]);

  const pause = useCallback(() => {
    setRunning(false);
    setPaused(false);
    clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback((minutes, seconds) => {
    setRunning(false);
    setPaused(false);
    clearInterval(intervalRef.current);
    setRemaining(minutes * 60 + seconds);
  }, []);

  useEffect(() => {
    if (running && !paused) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            // Notify
            if (Notification.permission === 'granted') {
              new Notification('Timer finished!');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, paused]);

  return { running, paused, remaining: format(remaining), start, pause, reset };
}