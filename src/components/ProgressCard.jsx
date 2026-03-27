import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Flame, Target, Share2, Award, Calendar } from 'lucide-react';

export const ProgressCard = ({
  wakeStreak,
  setWakeStreak,
  focusSessions,
  setFocusSessions,
  lastWakeDate,
  setLastWakeDate,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const getBadge = () => {
    if (wakeStreak >= 30) return { name: '🏆 Master', color: 'from-yellow-400 to-orange-500' };
    if (wakeStreak >= 14) return { name: '⭐ Pro', color: 'from-blue-400 to-purple-500' };
    if (wakeStreak >= 7) return { name: '🌟 Dedicated', color: 'from-green-400 to-teal-500' };
    return { name: '🌱 Beginner', color: 'from-gray-400 to-gray-500' };
  };

  const badge = getBadge();

  const logWakeUp = () => {
    if (lastWakeDate === today) {
      alert('Already logged today!');
      return;
    }

    // Check if consecutive day
    if (lastWakeDate) {
      const prev = new Date(lastWakeDate);
      const curr = new Date(today);
      const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        setWakeStreak(wakeStreak + 1);
      } else {
        setWakeStreak(1);
      }
    } else {
      setWakeStreak(1);
    }
    setLastWakeDate(today);
  };

  const startFocus = () => {
    setFocusSessions(focusSessions + 1);
    alert('Focus session started! 🎯');
  };

  const shareStats = async () => {
    const text = `My Clock Stats:\n🔥 Wake streak: ${wakeStreak} days\n🎯 Focus sessions: ${focusSessions}\n🏅 Badge: ${badge.name}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Clock Stats', text });
      } catch (err) {
        // user cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(text);
      alert('Stats copied to clipboard!');
    }
  };

  return (
    <Card title="Your Progress" icon={<Award className="w-5 h-5" />}>
      <div className="space-y-3">
        {/* Streak */}
        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
          <Flame className="w-5 h-5 text-orange-400" />
          <div className="flex-1">
            <div className="text-sm opacity-80">Wake streak</div>
            <div className="text-xl font-bold">{wakeStreak} days</div>
          </div>
        </div>

        {/* Focus Sessions */}
        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
          <Target className="w-5 h-5 text-blue-400" />
          <div className="flex-1">
            <div className="text-sm opacity-80">Focus sessions</div>
            <div className="text-xl font-bold">{focusSessions}</div>
          </div>
        </div>

        {/* Badge */}
        <div className={`bg-gradient-to-r ${badge.color} rounded-lg p-3 text-center`}>
          <div className="text-sm opacity-90">Current Badge</div>
          <div className="text-lg font-bold">{badge.name}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Button
            onClick={logWakeUp}
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Calendar size={16} />
            <span className="text-xs">Log Wake</span>
          </Button>
          <Button
            onClick={startFocus}
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Target size={16} />
            <span className="text-xs">Focus</span>
          </Button>
          <Button
            onClick={shareStats}
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Share2 size={16} />
            <span className="text-xs">Share</span>
          </Button>
        </div>

        {/* Last wake date */}
        {lastWakeDate && (
          <div className="text-xs text-center opacity-60 mt-2">
            Last logged: {new Date(lastWakeDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  );
};