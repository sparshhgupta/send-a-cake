import React, { useRef, useState } from 'react';
import { Wind, Moon, Sun } from 'lucide-react';
import { useThreeScene } from '../hooks/useThreeScene';
import { THEMES } from '../utils/constants';

export const CakeViewer = ({ 
  candles, 
  onCandlesChange, 
  selectedTheme, 
  autoRotate, 
  onAutoRotateToggle,
  candleStates,
  showControls = true,
  darkMode,
  setDarkMode
}) => {
  const mountRef = useRef(null);
  const [inputValue, setInputValue] = useState(candles);
  
  useThreeScene(mountRef, candles, selectedTheme, autoRotate, candleStates, darkMode);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const numValue = parseInt(inputValue) || 1;
      const clampedValue = Math.max(1, Math.min(100, numValue));
      setInputValue(clampedValue);
      onCandlesChange(clampedValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue) || 1;
    const clampedValue = Math.max(1, Math.min(100, numValue));
    setInputValue(clampedValue);
    onCandlesChange(clampedValue);
  };

  const getBackgroundStyle = () => {
    if (darkMode) {
      return {
        backgroundColor: '#0a0a0a',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
      };
    } else {
      return {
        backgroundColor: THEMES[selectedTheme].bg,
        background: `linear-gradient(135deg, ${THEMES[selectedTheme].bg} 0%, #ffffff 100%)`
      };
    }
  };

  return (
    <div>
      <div 
        ref={mountRef} 
        className="w-full rounded-2xl overflow-hidden shadow-2xl mb-4 border"
        style={{ 
          height: '500px',
          ...getBackgroundStyle(),
          borderColor: darkMode ? '#374151' : '#e5e7eb'
        }}
      />
      
      {showControls && (
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
            darkMode 
              ? 'bg-gray-900/80 border-gray-700' 
              : 'bg-gray-100 border-gray-300'
          }`}>
            <label className={`text-sm font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Number of candles:</label>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
              className={`w-24 px-3 py-2 text-center rounded-lg font-medium outline-none focus:ring-2 focus:ring-pink-500/20 transition-all ${
                darkMode
                  ? 'bg-gray-800 border-2 border-gray-600 text-white focus:border-pink-500'
                  : 'bg-white border-2 border-gray-300 text-gray-800 focus:border-pink-400'
              }`}
              min="1"
              max="100"
              placeholder="Enter number"
            />
            <span className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>(Press Enter)</span>
          </div>

          <button
            onClick={onAutoRotateToggle}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all shadow-lg ${
              autoRotate 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : darkMode 
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
            }`}
          >
            <Wind className="w-5 h-5" />
            <span className="text-sm font-medium">Auto Rotate</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all shadow-lg ${
              darkMode
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-sm font-medium">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};