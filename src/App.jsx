import React, { useState, useEffect } from 'react';
import { Clock } from './components/Clock';
import { Controls } from './components/Controls';
import { WorldClock } from './components/WorldClock';
import { AICard } from './components/AICard';
import { CalendarCard } from './components/CalendarCard';
import { ProgressCard } from './components/ProgressCard';
import { AlarmCard } from './components/AlarmCard';
import { Stopwatch } from './components/Stopwatch';
import { Timer } from './components/Timer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTime } from './hooks/useTime';
import { Sun, Moon, Sparkles } from 'lucide-react';

function App() {
  const [is24Hour, setIs24Hour] = useLocalStorage('clockFormat', true);
  const [theme, setTheme] = useLocalStorage('clockTheme', 'dark');
  const [clockFace, setClockFace] = useLocalStorage('clockFace', 'default');
  const [timezones, setTimezones] = useLocalStorage('timezones', [
    'local',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);
  const [events, setEvents] = useLocalStorage('events', [
    { name: 'Team Meeting', time: '10:00', date: new Date().toISOString().split('T')[0] },
  ]);
  const [wakeStreak, setWakeStreak] = useLocalStorage('wakeStreak', 0);
  const [focusSessions, setFocusSessions] = useLocalStorage('focusSessions', 0);
  const [lastWakeDate, setLastWakeDate] = useLocalStorage('lastWakeDate', null);
  const [alarmTime, setAlarmTime] = useLocalStorage('alarmTime', null);
  const [weather, setWeather] = useState({ temp: 22, condition: 'sunny', icon: '☀️' });

  const { now, timeString, dateString } = useTime(is24Hour);

  // Simulate weather based on hour
  useEffect(() => {
    const hour = now.getHours();
    if (hour < 6) setWeather({ temp: 18, condition: 'night', icon: '🌙' });
    else if (hour < 12) setWeather({ temp: 22, condition: 'morning', icon: '🌤️' });
    else if (hour < 18) setWeather({ temp: 28, condition: 'afternoon', icon: '☀️' });
    else setWeather({ temp: 24, condition: 'evening', icon: '🌆' });
  }, [now]);

  // Apply theme class to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 p-4 text-white">
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 shadow-2xl">
        {/* Clock */}
        <Clock
          timeString={timeString}
          dateString={dateString}
          weather={weather}
          clockFace={clockFace}
        />

        {/* Controls */}
        <Controls
          is24Hour={is24Hour}
          setIs24Hour={setIs24Hour}
          clockFace={clockFace}
          setClockFace={setClockFace}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          <WorldClock timezones={timezones} setTimezones={setTimezones} is24Hour={is24Hour} now={now} />
          <AICard now={now} weather={weather} lastWakeDate={lastWakeDate} />
          <CalendarCard events={events} setEvents={setEvents} now={now} />
          <ProgressCard
            wakeStreak={wakeStreak}
            setWakeStreak={setWakeStreak}
            focusSessions={focusSessions}
            setFocusSessions={setFocusSessions}
            lastWakeDate={lastWakeDate}
            setLastWakeDate={setLastWakeDate}
          />
          <AlarmCard alarmTime={alarmTime} setAlarmTime={setAlarmTime} weather={weather} />
          <Stopwatch />
          <Timer />
        </div>
      </div>
    </div>
  );
}

export default App;