import { useState, useRef, useCallback } from 'react';

export function useStopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const startTimeRef = useRef(0);
  const intervalRef = useRef();

  const start = useCallback(() => {
    if (running) {
      // pause
      setRunning(false);
      clearInterval(intervalRef.current);
      setElapsed(prev => prev + (Date.now() - startTimeRef.current) / 1000);
    } else {
      setRunning(true);
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 0.1);
      }, 100);
    }
  }, [running]);

  const lap = useCallback(() => {
    if (running) {
      const total = elapsed + (Date.now() - startTimeRef.current) / 1000;
      setLaps(prev => [...prev, formatStopwatch(total)]);
    }
  }, [running, elapsed]);

  const reset = useCallback(() => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setElapsed(0);
    setLaps([]);
  }, []);

  const formatStopwatch = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ds = Math.floor((seconds * 10) % 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ds}`;
  };

  return { running, elapsed: formatStopwatch(elapsed), laps, start, lap, reset };
}