import React from 'react';

export const Button = ({ children, onClick, variant = 'default', size = 'md', className = '', ...props }) => {
  const base = 'rounded-full font-semibold transition backdrop-blur-sm border';
  const variants = {
    default: 'bg-white/20 hover:bg-white/30 text-white border-white/20',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30',
    success: 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30',
  };
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};