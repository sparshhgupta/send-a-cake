import React from 'react';
import { Sparkles } from 'lucide-react';

export const CelebrationOverlay = ({ wishMessage, candles, onReset }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-md z-40 rounded-3xl">
    <div className="text-center p-8 md:p-12 max-w-md">
      <div className="mb-6 animate-bounce">
        <Sparkles className="w-16 h-16 mx-auto text-yellow-500" />
      </div>
      <p className="text-4xl md:text-6xl font-light text-gray-800 mb-4">
        {wishMessage}
      </p>
      <p className="text-gray-500 text-sm md:text-base mb-6">
        All {candles} candles blown out perfectly!
      </p>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-medium hover:shadow-lg transition-all"
      >
        Celebrate Again
      </button>
    </div>
  </div>
);