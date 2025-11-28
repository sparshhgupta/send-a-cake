import React from 'react';

export const ControlButton = ({ onClick, icon: Icon, label, variant = 'default', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-400 to-cyan-400',
    danger: 'bg-gradient-to-r from-red-400 to-pink-400',
    success: 'bg-gradient-to-r from-green-400 to-emerald-400',
    share: 'bg-gradient-to-r from-pink-500 to-purple-500',
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  };

  const baseClass = variant === 'default' 
    ? 'p-3 rounded-full transition-all shadow'
    : 'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg text-white hover:shadow-xl';

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      title={label}
    >
      <Icon className="w-5 h-5" />
      {variant !== 'default' && label}
    </button>
  );
};