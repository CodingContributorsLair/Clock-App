import React from 'react';

export const Card = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 shadow-xl ${className}`}>
      <h3 className="text-xl font-semibold flex items-center gap-2 pb-3 border-b border-white/20 mb-3">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
};