import React, { useRef } from 'react';
import { Plus, Minus, Wind } from 'lucide-react';
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
  
  useThreeScene(mountRef, candles, selectedTheme, autoRotate, candleStates);

  return (
    <div>
      <div 
        ref={mountRef} 
        className="w-full rounded-2xl overflow-hidden shadow-inner mb-4"
        style={{ height: '500px', backgroundColor: THEMES[selectedTheme].bg }}
      />
      
      {showControls && (
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
            <button
              onClick={() => onCandlesChange(Math.max(1, candles - 1))}
              className="p-2 hover:bg-gray-200 rounded-full transition-all"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
            
            <input
              type="number"
              value={candles}
              onChange={(e) => onCandlesChange(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="w-16 text-center bg-transparent font-medium text-gray-800 outline-none"
              min="1"
              max="50"
            />
            
            <button
              onClick={() => onCandlesChange(Math.min(50, candles + 1))}
              className="p-2 hover:bg-gray-200 rounded-full transition-all"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <button
            onClick={onAutoRotateToggle}
            className={`p-3 rounded-full transition-all shadow ${autoRotate ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Toggle Auto-Rotate"
          >
            <Wind className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};