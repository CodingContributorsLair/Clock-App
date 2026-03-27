import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { useTimer } from '../hooks/useTimer';

export const Timer = () => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const { running, paused, remaining, start, pause, reset } = useTimer(minutes, seconds);

  const handleStart = () => {
    start(minutes, seconds);
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = () => {
    reset(minutes, seconds);
  };

  return (
    <Card title="Timer" icon={<span className="text-2xl">⏲️</span>}>
      <div className="flex gap-2 mb-3">
        <Input
          type="number"
          min="0"
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
          placeholder="Min"
          className="flex-1"
        />
        <Input
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
          placeholder="Sec"
          className="flex-1"
        />
      </div>
      <div className="text-5xl font-mono text-center py-4 bg-black/20 rounded-xl mb-3">
        {remaining}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleStart} size="sm" className="flex-1">
          {running && !paused ? 'Pause' : running ? 'Resume' : 'Start'}
        </Button>
        <Button onClick={handlePause} size="sm" className="flex-1" variant="danger" disabled={!running}>
          Pause
        </Button>
        <Button onClick={handleReset} size="sm" className="flex-1" variant="danger">
          Reset
        </Button>
      </div>
    </Card>
  );
};