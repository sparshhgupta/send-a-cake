import React from 'react';
import { Mic, MicOff, RotateCcw, Volume2, VolumeX, Camera, Wind, Moon, Sun } from 'lucide-react';
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
  confetti,
  darkMode,
  setDarkMode
}) => {
  const litCandlesCount = candleStates.filter(s => s).length;
  const progressPercent = Math.round(((candles - litCandlesCount) / candles) * 100);

  const getBackgroundStyle = () => {
    if (darkMode) {
      return {
        backgroundColor: '#0a0a0a',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
      };
    } else {
      return {
        backgroundColor: THEMES[selectedTheme].bg,
        background: `linear-gradient(135deg, ${THEMES[selectedTheme].bg} 0%, #ffffff 100%)`
      };
    }
  };

  const getContainerStyle = () => {
    return darkMode 
      ? 'bg-gray-900/60 border-gray-800'
      : 'bg-white/80 border-gray-200';
  };

  const getTextStyle = () => {
    return darkMode ? 'text-white' : 'text-gray-800';
  };

  const getMutedTextStyle = () => {
    return darkMode ? 'text-gray-400' : 'text-gray-600';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-500"
      style={getBackgroundStyle()}
    >
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <h1 className={`text-5xl md:text-7xl font-light mb-3 tracking-tight ${
            darkMode 
              ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
              : 'text-gray-800'
          }`}>
            Happy Birthday, {recipientName}! 🎂
          </h1>
          <p className={`text-lg md:text-xl font-light mb-2 ${getMutedTextStyle()}`}>
            {senderName} has created this special cake for you
          </p>
          {personalMessage && (
            <p className={`text-base italic max-w-2xl mx-auto mt-4 p-4 rounded-xl border ${
              darkMode 
                ? 'text-gray-300 bg-gray-800/50 border-gray-700'
                : 'text-gray-700 bg-white/50 border-gray-200'
            }`}>
              "{personalMessage}"
            </p>
          )}
        </div>

        <div className={`backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-8 relative overflow-hidden border ${getContainerStyle()}`}>
          <ConfettiParticle confetti={confetti} />

          {showCelebration && (
            <CelebrationOverlay
              wishMessage={wishMessage}
              candles={candles}
              onReset={resetCandles}
              darkMode={darkMode}
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

            {/* Theme Toggle Button */}
            <ControlButton
              onClick={() => setDarkMode(!darkMode)}
              icon={darkMode ? Sun : Moon}
              label={darkMode ? 'Light Mode' : 'Dark Mode'}
              variant="default"
            />
          </div>

          {isListening && (
            <div className={`mb-6 rounded-2xl p-4 border ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <p className={`text-sm font-medium flex items-center gap-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Wind className="w-4 h-4" />
                  Voice Input Active
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {blowStrength > 1.5 ? '🌪️ Strong!' : blowStrength > 0.8 ? '💨 Good' : '🌬️ Blow harder'}
                </p>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden shadow-inner ${
                darkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-100 rounded-full"
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
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard 
              value={litCandlesCount} 
              label="Candles Lit" 
              gradient={darkMode ? "from-pink-900/50 to-purple-900/50" : "from-pink-50 to-purple-50"}
              darkMode={darkMode}
            />
            <StatsCard 
              value={candles - litCandlesCount} 
              label="Blown Out" 
              gradient={darkMode ? "from-blue-900/50 to-cyan-900/50" : "from-blue-50 to-cyan-50"}
              darkMode={darkMode}
            />
            <StatsCard 
              value={capturedPhotos.length} 
              label="Photos Taken" 
              gradient={darkMode ? "from-yellow-900/50 to-orange-900/50" : "from-yellow-50 to-orange-50"}
              darkMode={darkMode}
            />
            <StatsCard 
              value={`${progressPercent}%`} 
              label="Progress" 
              gradient={darkMode ? "from-green-900/50 to-emerald-900/50" : "from-green-50 to-emerald-50"}
              darkMode={darkMode}
            />
          </div>

          <PhotoGallery photos={capturedPhotos} onDownload={downloadPhoto} darkMode={darkMode} />

          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              🎤 Click "Start Blowing" and blow into your microphone
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Drag to rotate • Scroll to zoom • Take photos to remember this moment
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className={`text-sm font-light ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            Sent with love from {senderName} ✨
          </p>
        </div>
      </div>
    </div>
  );
};