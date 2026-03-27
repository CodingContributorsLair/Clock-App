import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

export const AlarmCard = ({ alarmTime, setAlarmTime, weather }) => {
  const [inputTime, setInputTime] = useState(alarmTime || '07:00');

  const setAlarm = () => {
    if (inputTime) {
      setAlarmTime(inputTime);
    }
  };

  const clearAlarm = () => {
    setAlarmTime(null);
  };

  // Check alarm every second (handled in App with useEffect, but we show status)
  useEffect(() => {
    if (!alarmTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (current === alarmTime) {
        // Trigger alarm
        if (Notification.permission === 'granted') {
          new Notification('⏰ Alarm!', { body: 'Time to wake up!' });
        }
        setAlarmTime(null); // clear after trigger
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarmTime, setAlarmTime]);

  const smartSuggestion = weather.condition.includes('rain')
    ? '☔ Raining – leave 15min earlier.'
    : '⏰ Good morning!';

  return (
    <Card title="Smart Alarm" icon={<span className="text-2xl">⏰</span>}>
      <Input
        type="time"
        value={inputTime}
        onChange={(e) => setInputTime(e.target.value)}
        className="mb-3"
      />
      <div className="flex gap-2 mb-3">
        <Button onClick={setAlarm} size="sm" className="flex-1">Set</Button>
        <Button onClick={clearAlarm} size="sm" className="flex-1" variant="danger">Clear</Button>
      </div>
      <div className="text-sm">
        {alarmTime ? `Alarm set for ${alarmTime}` : 'No alarm set'}
      </div>
      {alarmTime && (
        <div className="mt-2 bg-green-500/20 rounded-full px-3 py-1 text-sm">
          {smartSuggestion}
        </div>
      )}
    </Card>
  );
};