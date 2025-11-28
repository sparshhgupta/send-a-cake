import React from 'react';
import { THEMES } from '../utils/constants';

export const ThemeSelector = ({ selectedTheme, onThemeChange, darkMode = true }) => {
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>Cake Theme</label>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(THEMES).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => onThemeChange(key)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedTheme === key
                ? 'border-pink-500 ring-2 ring-pink-500/20'
                : darkMode
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ 
              backgroundColor: darkMode ? '#1f2937' : theme.bg 
            }}
          >
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-400"
                  style={{ backgroundColor: `#${theme.cake.toString(16).padStart(6, '0')}` }}
                />
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {theme.name}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};