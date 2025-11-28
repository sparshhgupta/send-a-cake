import React from 'react';
import { Mic, MicOff, RotateCcw, Camera } from 'lucide-react';
import { CakeViewer } from './CakeViewer';
import { StatsCard } from './StatsCard';
import { ControlButton } from './ControlButton';
import { THEMES } from '../utils/constants';

export const ReceiverMode = ({
  candles,
  selectedTheme,
  autoRotate,
  setAutoRotate,
  recipientName,
  senderName,
  personalMessage,
  candleStates,
  isListening,
  startListening,
  stopListening,
  blowStrength,
  showCelebration,
  resetCandles,
  captureScreenshot,
  capturedPhotos
}) => {
  const litCandlesCount = candleStates.filter(s => s).length;
  const progressPercent = Math.round(((candles - litCandlesCount) / candles) * 100);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
      style={{ backgroundColor: THEMES[selectedTheme].bg }}
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-5xl font-light text-gray-800 mb-2">
            Happy Birthday, {recipientName}! 🎂
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-light mb-2">
            From {senderName}
          </p>
          {personalMessage && (
            <p className="text-gray-700 text-sm italic max-w-xl mx-auto mt-2 bg-white/50 p-3 rounded-xl">
              "{personalMessage}"
            </p>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-200">
          {showCelebration && (
            <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center bg-white/90 p-6 rounded-xl shadow-2xl">
                <h2 className="text-2xl md:text-4xl font-bold text-yellow-600 mb-2">
                  🎉 Happy Birthday! 🎉
                </h2>
                <p className="text-gray-700 mb-4">All candles blown out!</p>
                <button
                  onClick={resetCandles}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Blow Again
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <ControlButton
              onClick={isListening ? stopListening : startListening}
              icon={isListening ? MicOff : Mic}
              label={isListening ? 'Stop' : 'Blow'}
              variant={isListening ? 'danger' : 'primary'}
            />
            
            <ControlButton
              onClick={captureScreenshot}
              icon={Camera}
              label="Photo"
              variant="success"
            />

            <ControlButton
              onClick={resetCandles}
              icon={RotateCcw}
              label="Reset"
              variant="default"
            />
          </div>

          {isListening && (
            <div className="mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-medium text-gray-700">
                  Blow into microphone
                </p>
                <p className="text-xs text-gray-600">
                  {blowStrength > 1.5 ? 'Strong!' : blowStrength > 0.8 ? 'Good' : 'Blow harder'}
                </p>
              </div>
              <div className="w-full h-1 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-100 rounded-full"
                  style={{ width: `${Math.min(blowStrength * 33, 100)}%` }}
                />
              </div>
            </div>
          )}

          <CakeViewer
            candles={candles}
            selectedTheme={selectedTheme}
            autoRotate={autoRotate}
            candleStates={candleStates}
            showControls={false}
          />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatsCard value={litCandlesCount} label="Lit" gradient="from-pink-50 to-purple-50" />
            <StatsCard value={candles - litCandlesCount} label="Blown" gradient="from-blue-50 to-cyan-50" />
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              🎤 Tap "Blow" and blow into your microphone
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drag to rotate • Pinch to zoom
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-600 font-light">
            Made with love by {senderName} ✨
          </p>
        </div>
      </div>
    </div>
  );
};