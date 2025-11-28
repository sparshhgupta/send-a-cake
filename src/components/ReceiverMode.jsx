import React from 'react';
import { Mic, MicOff, RotateCcw, Volume2, VolumeX, Camera, Wind } from 'lucide-react';
import { CakeViewer } from './CakeViewer';
import { StatsCard } from './StatsCard';
import { PhotoGallery } from './PhotoGallery';
import { CelebrationOverlay } from './CelebrationOverlay';
import { ConfettiParticle } from './ConfettiParticle';
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
  wishMessage,
  resetCandles,
  captureScreenshot,
  capturedPhotos,
  downloadPhoto,
  soundEnabled,
  setSoundEnabled,
  confetti
}) => {
  const litCandlesCount = candleStates.filter(s => s).length;
  const progressPercent = Math.round(((candles - litCandlesCount) / candles) * 100);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-500"
      style={{ backgroundColor: THEMES[selectedTheme].bg }}
    >
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-3 tracking-tight">
            Happy Birthday, {recipientName}! 🎂
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-light mb-2">
            {senderName} has created this special cake for you
          </p>
          {personalMessage && (
            <p className="text-gray-700 text-base italic max-w-2xl mx-auto mt-4 bg-white/50 p-4 rounded-xl">
              "{personalMessage}"
            </p>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-8 relative overflow-hidden border border-gray-200">
          <ConfettiParticle confetti={confetti} />

          {showCelebration && (
            <CelebrationOverlay
              wishMessage={wishMessage}
              candles={candles}
              onReset={resetCandles}
            />
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <ControlButton
              onClick={isListening ? stopListening : startListening}
              icon={isListening ? MicOff : Mic}
              label={isListening ? 'Stop Listening' : 'Start Blowing'}
              variant={isListening ? 'danger' : 'primary'}
            />
            
            <ControlButton
              onClick={captureScreenshot}
              icon={Camera}
              label="Take Photo"
              variant="success"
            />

            <ControlButton
              onClick={resetCandles}
              icon={RotateCcw}
              label="Reset"
              variant="default"
            />

            <ControlButton
              onClick={() => setSoundEnabled(!soundEnabled)}
              icon={soundEnabled ? Volume2 : VolumeX}
              label={soundEnabled ? 'Mute' : 'Unmute'}
              variant="default"
            />

            <ControlButton
              onClick={() => setAutoRotate(!autoRotate)}
              icon={Wind}
              label="Toggle Auto-Rotate"
              variant="default"
            />
          </div>

          {isListening && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Voice Input Active
                </p>
                <p className="text-sm text-gray-600">
                  {blowStrength > 1.5 ? '🌪️ Strong!' : blowStrength > 0.8 ? '💨 Good' : '🌬️ Blow harder'}
                </p>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
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

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard value={litCandlesCount} label="Candles Lit" gradient="from-pink-50 to-purple-50" />
            <StatsCard value={candles - litCandlesCount} label="Blown Out" gradient="from-blue-50 to-cyan-50" />
            <StatsCard value={capturedPhotos.length} label="Photos Taken" gradient="from-yellow-50 to-orange-50" />
            <StatsCard value={`${progressPercent}%`} label="Progress" gradient="from-green-50 to-emerald-50" />
          </div>

          <PhotoGallery photos={capturedPhotos} onDownload={downloadPhoto} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              🎤 Click "Start Blowing" and blow into your microphone
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Drag to rotate • Scroll to zoom • Take photos to remember this moment
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 font-light">
            Sent with love from {senderName} ✨
          </p>
        </div>
      </div>
    </div>
  );
};