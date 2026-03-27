import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { RefreshCw, Cloud, Coffee, Award, Calendar, Droplet, Moon, Sun, TrendingUp } from 'lucide-react';

export const AICard = ({
  now,
  weather,
  lastWakeDate,
  wakeStreak = 0,
  focusSessions = 0,
  events = [],
  onRefresh // optional callback if you want to refresh data from parent
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [habitCheck, setHabitCheck] = useState({ water: false, stretch: false });

  const hour = now.getHours();
  const today = now.toISOString().split('T')[0];
  const todaysEvents = events.filter(e => e.date === today).sort((a, b) => a.time.localeCompare(b.time));

  // ---------- Productivity Score ----------
  const calculateProductivityScore = () => {
    let score = 50; // base
    score += Math.min(wakeStreak * 2, 20);
    score += Math.min(focusSessions * 3, 15);
    if (hour >= 9 && hour <= 11) score += 10;
    else if (hour >= 14 && hour <= 16) score += 5;
    else if (hour >= 22 || hour <= 5) score -= 10;
    return Math.min(100, Math.max(0, score));
  };
  const prodScore = calculateProductivityScore();

  // ---------- Main Tip ----------
  let mainTip = '';
  let tipIcon = null;
  if (hour < 5) {
    mainTip = '🌙 Late night – your body needs rest. Consider sleeping soon.';
    tipIcon = <Moon size={20} />;
  } else if (hour < 8) {
    mainTip = '☀️ Good morning! Plan your top 3 priorities for today.';
    tipIcon = <Sun size={20} />;
  } else if (hour < 11) {
    mainTip = '⚡ Peak productivity – tackle deep work now.';
    tipIcon = <TrendingUp size={20} />;
  } else if (hour < 14) {
    mainTip = '🍽️ Post‑lunch dip – perfect for routine tasks.';
    tipIcon = <Coffee size={20} />;
  } else if (hour < 17) {
    mainTip = '💪 Afternoon energy – great for collaboration.';
    tipIcon = <TrendingUp size={20} />;
  } else if (hour < 20) {
    mainTip = '🌆 Evening – review accomplishments and plan tomorrow.';
    tipIcon = <Sun size={20} />;
  } else {
    mainTip = '🌙 Wind down – avoid screens for better sleep.';
    tipIcon = <Moon size={20} />;
  }

  // Weather enhancement
  if (weather.condition.includes('rain')) {
    mainTip += ' ☔ Rainy – allow extra travel time.';
  } else if (weather.condition.includes('snow')) {
    mainTip += ' ❄️ Snow – drive carefully.';
  } else if (weather.temp > 30) {
    mainTip += ' 🔥 Hot – stay hydrated and wear light clothes.';
  } else if (weather.temp < 5) {
    mainTip += ' ❄️ Cold – dress warmly.';
  }

  // ---------- Outfit Suggestion ----------
  let outfitSuggestion = '';
  if (weather.temp > 25) outfitSuggestion = '👕 T‑shirt and shorts';
  else if (weather.temp > 15) outfitSuggestion = '👚 Light jacket or sweater';
  else if (weather.temp > 5) outfitSuggestion = '🧥 Coat and scarf';
  else outfitSuggestion = '🧣 Heavy winter gear';
  if (weather.condition.includes('rain')) outfitSuggestion += ' + ☔ umbrella';

  // ---------- Sleep Analysis ----------
  let sleepMsg = '';
  let sleepIcon = null;
  if (lastWakeDate) {
    const last = new Date(lastWakeDate);
    const hoursSince = (now - last) / 36e5;
    if (hoursSince > 16) {
      sleepMsg = '⚠️ You\'ve been awake >16h – rest recommended.';
      sleepIcon = '⚠️';
    } else if (hoursSince < 6) {
      sleepMsg = '😴 You woke up recently. Ready to conquer the day!';
      sleepIcon = '😴';
    } else {
      sleepMsg = `😊 Awake for ${Math.floor(hoursSince)}h. Try to sleep by 11 PM for best recovery.`;
      sleepIcon = '😊';
    }
  } else {
    sleepMsg = 'Log your wake‑up time to get sleep insights.';
    sleepIcon = '⏰';
  }

  // ---------- Event Previews ----------
  const eventPreviews = todaysEvents.slice(0, 3).map(ev => {
    const [eh, em] = ev.time.split(':').map(Number);
    const eventTime = new Date(now);
    eventTime.setHours(eh, em, 0);
    const diffMin = (eventTime - now) / 60000;
    let status;
    if (diffMin < 0) status = '✅ Done';
    else if (diffMin < 15) status = '🔴 Now!';
    else if (diffMin < 60) status = `🟡 In ${Math.floor(diffMin)}m`;
    else status = `⏳ In ${Math.floor(diffMin / 60)}h`;
    return { ...ev, status };
  });

  // ---------- Habit Reminders ----------
  const habitReminder = () => {
    if (!habitCheck.water && Math.random() > 0.7) return '💧 Time to drink water!';
    if (!habitCheck.stretch && hour % 2 === 0) return '🧘 Stretch for 2 minutes!';
    return null;
  };
  const habitMsg = habitReminder();

  // ---------- Motivational Quotes ----------
  const quotes = [
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
    { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
    { text: 'Your time is limited, don’t waste it living someone else’s life.', author: 'Steve Jobs' },
    { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
    { text: 'Khudi ko kar buland itna ke har taqdeer se pehle, Khuda bande se khud poochhe ke bata teri raza kya hai.', author: 'Allama Iqbal' },
    { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Abdul Sattar Edhi' },
    { text: 'Come, let us lay bare the heart of this matter – that you and I are more than this earth and sky.', author: 'Faiz Ahmed Faiz' },
    { text: 'A person who is not motivated by anything except money is a poor soul.', author: 'Imran Khan' },
    { text: 'The only thing necessary for the triumph of evil is for good men to do nothing.', author: 'Malala Yousafzai' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 120000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // ---------- Productivity Tips ----------
  const tips = [
    { text: 'Try Pomodoro: 25min work, 5min break.', icon: '🍅' },
    { text: 'Stand up and stretch for 2 minutes.', icon: '🧘' },
    { text: 'Drink a glass of water.', icon: '💧' },
    { text: 'Close unused browser tabs.', icon: '🗂️' },
    { text: 'Write down your top 3 priorities.', icon: '📝' },
    { text: 'Take a 5‑minute mindfulness break.', icon: '🧠' },
    { text: 'Review your goals for the week.', icon: '🎯' },
    { text: 'Declutter your workspace.', icon: '✨' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 60000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const refreshAll = () => {
    setTipIndex(prev => (prev + 1) % tips.length);
    setQuoteIndex(prev => (prev + 1) % quotes.length);
    setHabitCheck({ water: Math.random() > 0.5, stretch: Math.random() > 0.5 });
    if (onRefresh) onRefresh();
  };

  const currentTip = tips[tipIndex];
  const currentQuote = quotes[quoteIndex];

  return (
    <Card title="Smart Assistant" icon={<span className="text-2xl">🧠</span>}>
      {/* Productivity Score */}
      <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3">
        <span className="text-sm font-medium">Productivity Score</span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-green-300" style={{ width: `${prodScore}%` }}></div>
          </div>
          <span className="text-sm font-bold">{prodScore}</span>
        </div>
      </div>

      {/* Main tip with weather + outfit */}
      <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4 mb-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{tipIcon}</span>
          <p className="flex-1 text-sm md:text-base">{mainTip}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm opacity-80">
          <Cloud size={16} />
          <span>{outfitSuggestion}</span>
        </div>
      </div>

      {/* Sleep analysis */}
      <div className="flex items-center gap-2 mb-2 text-sm bg-white/5 rounded-lg p-2">
        <span className="text-xl">{sleepIcon}</span>
        <span>{sleepMsg}</span>
      </div>

      {/* Event previews */}
      {eventPreviews.length > 0 && (
        <div className="mb-2 space-y-1">
          {eventPreviews.map((ev, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs bg-blue-500/10 rounded-lg px-3 py-1.5">
              <span className="font-medium">{ev.name}</span>
              <span>{ev.time}</span>
              <span>{ev.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Habit reminder */}
      {habitMsg && (
        <div className="flex items-center gap-2 mb-2 text-sm bg-yellow-500/10 rounded-lg p-2">
          <Droplet size={16} className="text-yellow-300" />
          <span>{habitMsg}</span>
        </div>
      )}

      {/* Motivational quote with fixed height to prevent card resizing */}
      <div className="mt-3 pt-2 border-t border-white/20">
        <div className="h-16 overflow-y-auto text-sm italic opacity-90 pr-1 scrollbar-thin">
          “{currentQuote.text}” – {currentQuote.author}
        </div>
      </div>

      {/* Productivity tip with refresh */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xl">{currentTip.icon}</span>
          <span className="opacity-90">{currentTip.text}</span>
        </div>
        <button
          onClick={refreshAll}
          className="p-1 hover:bg-white/20 rounded-full transition"
          title="Refresh insights"
        >
          <RefreshCw size={16} className="opacity-70" />
        </button>
      </div>
    </Card>
  );
};