import React, { useRef, useState } from 'react';
import { Wind } from 'lucide-react';
import { useThreeScene } from '../hooks/useThreeScene';
import { THEMES } from '../utils/constants';

export const CakeViewer = ({ 
  candles, 
  onCandlesChange, 
  selectedTheme, 
  autoRotate, 
  onAutoRotateToggle,
  candleStates,
  showControls = true 
}) => {
  const mountRef = useRef(null);
  const [inputValue, setInputValue] = useState(candles);
  
  useThreeScene(mountRef, candles, selectedTheme, autoRotate, candleStates);

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

  return (
    <div>
      <div 
        ref={mountRef} 
        className="w-full rounded-2xl overflow-hidden shadow-inner mb-4"
        style={{ height: '500px', backgroundColor: THEMES[selectedTheme].bg }}
      />
      
      {showControls && (
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
            <label className="text-sm font-medium text-gray-700">Number of candles:</label>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
              className="w-24 px-3 py-2 text-center bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
              min="1"
              max="100"
              placeholder="Enter number"
            />
            <span className="text-xs text-gray-500">(Press Enter)</span>
          </div>

          <button
            onClick={onAutoRotateToggle}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all shadow ${
              autoRotate 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Wind className="w-5 h-5" />
            <span className="text-sm font-medium">Auto Rotate</span>
          </button>
        </div>
      )}
    </div>
  );
};