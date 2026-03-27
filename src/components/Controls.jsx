import React from 'react';
import { Button } from './Button';
import { Sun, Moon, Mic, Monitor, Palette } from 'lucide-react';

export const Controls = ({
  is24Hour,
  setIs24Hour,
  clockFace,
  setClockFace,
  theme,
  toggleTheme,
  onVoice,
}) => {
  const faces = ['default', 'minimal', 'neon', 'retro', 'futuristic', 'nature'];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6 p-5 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
      {/* Format Selector */}
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
        <Monitor size={18} className="text-white/70" />
        <select
          value={is24Hour ? '24' : '12'}
          onChange={(e) => setIs24Hour(e.target.value === '24')}
          className="bg-transparent text-white border-none focus:ring-0 text-sm appearance-none cursor-pointer pr-6"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.25rem',
          }}
        >
          <option value="24" className="bg-gray-800">24‑hour</option>
          <option value="12" className="bg-gray-800">12‑hour</option>
        </select>
      </div>

      {/* Clock Face Selector */}
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
        <Palette size={18} className="text-white/70" />
        <select
          value={clockFace}
          onChange={(e) => setClockFace(e.target.value)}
          className="bg-transparent text-white border-none focus:ring-0 text-sm appearance-none cursor-pointer pr-6"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.25rem',
          }}
        >
          {faces.map((face) => (
            <option key={face} value={face} className="bg-gray-800">
              {face.charAt(0).toUpperCase() + face.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Theme Toggle Button */}
      {/* <Button
        onClick={toggleTheme}
        size="sm"
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 rounded-full px-5 py-2 transition-all duration-200 hover:scale-105"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        <span className="text-sm font-medium">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
      </Button> */}

      {/* Voice Button */}
      <Button
        onClick={onVoice}
        size="sm"
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 rounded-full px-5 py-2 transition-all duration-200 hover:scale-105"
      >
        <Mic size={18} />
        <span className="text-sm font-medium">Voice</span>
      </Button>
    </div>
  );
};