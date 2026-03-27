import { useState, useEffect } from 'react';

export function useTime(is24Hour) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = is24Hour
    ? now.toLocaleTimeString('en-US', { hour12: false })
    : now.toLocaleTimeString('en-US', { hour12: true });

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return { now, timeString, dateString };
}