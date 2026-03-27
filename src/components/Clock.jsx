import React from 'react';

export const Clock = ({ timeString, dateString, weather, clockFace }) => {
  // Map clock face to Tailwind classes for typography and effects
  const faceClass = {
    default: 'font-sans drop-shadow-lg',
    minimal: 'font-light tracking-[0.2em] text-white/90',
    neon: 'font-sans text-cyan-300 drop-shadow-[0_0_15px_#0ff] animate-pulse',
    retro: 'font-mono text-amber-300 drop-shadow-[4px_4px_0_#f0f,8px_8px_0_#0ff]',
    futuristic:
      "font-['Orbitron',sans-serif] bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg",
    nature:
      "font-['Dosis',sans-serif] bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent",
  }[clockFace] || 'font-sans';

  return (
    <div className="text-center bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
      {/* Main Time Display */}
      <div className={`text-7xl sm:text-8xl md:text-9xl font-bold leading-none ${faceClass}`}>
        {timeString}
      </div>

      {/* Date */}
      <div className="text-xl sm:text-2xl md:text-3xl mt-4 font-light tracking-wide text-white/80">
        {dateString}
      </div>

      {/* Weather Info with subtle animation */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xl md:text-2xl bg-white/10 backdrop-blur-sm rounded-full py-3 px-6 w-fit mx-auto border border-white/20">
        <span className="text-4xl animate-weather">{weather.icon}</span>
        <span className="font-medium">{weather.temp}°C</span>
        <span className="capitalize opacity-90">{weather.condition}</span>
      </div>

      {/* Decorative line */}
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-6"></div>
    </div>
  );
};