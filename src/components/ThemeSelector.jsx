import React from 'react';
import { THEMES } from '../utils/constants';

export const ThemeSelector = ({ selectedTheme, onThemeChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => onThemeChange(key)}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedTheme === key ? 'border-gray-800 shadow-lg' : 'border-gray-300'
          }`}
          style={{ backgroundColor: theme.bg }}
        >
          <p className="text-sm font-medium text-gray-800">{theme.name}</p>
        </button>
      ))}
    </div>
  </div>
);