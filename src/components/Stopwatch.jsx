import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { useStopwatch } from '../hooks/useStopwatch';

export const Stopwatch = () => {
  const { running, elapsed, laps, start, lap, reset } = useStopwatch();

  return (
    <Card title="Stopwatch" icon={<span className="text-2xl">⏱️</span>}>
      <div className="text-5xl font-mono text-center py-4 bg-black/20 rounded-xl mb-3">
        {elapsed}
      </div>
      <div className="flex gap-2 mb-3">
        <Button onClick={start} size="sm" className="flex-1">
          {running ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={lap} size="sm" className="flex-1" disabled={!running}>
          Lap
        </Button>
        <Button onClick={reset} size="sm" className="flex-1" variant="danger">
          Reset
        </Button>
      </div>
      <div className="max-h-24 overflow-y-auto space-y-1">
        {laps.map((lapTime, idx) => (
          <div key={idx} className="text-sm bg-white/5 rounded px-2 py-1">
            Lap {idx + 1}: {lapTime}
          </div>
        ))}
      </div>
    </Card>
  );
};