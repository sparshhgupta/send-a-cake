import React from 'react';
import { Share2, Edit3 } from 'lucide-react';
import { CakeViewer } from './CakeViewer';
import { ThemeSelector } from './ThemeSelector';
import { ShareModal } from './ShareModal';
import { THEMES } from '../utils/constants';

export const CreatorMode = ({
  candles,
  setCandles,
  selectedTheme,
  setSelectedTheme,
  autoRotate,
  setAutoRotate,
  recipientName,
  setRecipientName,
  senderName,
  setSenderName,
  personalMessage,
  setPersonalMessage,
  shareableLink,
  showShareModal,
  setShowShareModal,
  generateShareableLink,
  copyToClipboard,
  candleStates,
  darkMode,
  setDarkMode
}) => {
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

  const getInputStyle = () => {
    return darkMode
      ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500/20'
      : 'border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-pink-400 focus:ring-pink-200';
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
            Create Birthday Celebration
          </h1>
          <p className={`text-lg md:text-xl font-light ${getMutedTextStyle()}`}>
            Design a personalized cake and share it with someone special
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className={`lg:col-span-2 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border ${getContainerStyle()}`}>
            <CakeViewer
              candles={candles}
              onCandlesChange={setCandles}
              selectedTheme={selectedTheme}
              autoRotate={autoRotate}
              onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
              candleStates={candleStates}
              showControls={true}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </div>

          <div className={`backdrop-blur-sm rounded-3xl shadow-2xl p-6 border ${getContainerStyle()}`}>
            <h2 className={`text-2xl font-semibold mb-4 flex items-center gap-2 ${getTextStyle()}`}>
              <Edit3 className="w-6 h-6" />
              Customize
            </h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${getMutedTextStyle()}`}>Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's name"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${getInputStyle()}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getMutedTextStyle()}`}>Your Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${getInputStyle()}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${getMutedTextStyle()}`}>Personal Message</label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Write a birthday wish..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${getInputStyle()}`}
                />
              </div>

              <ThemeSelector 
                selectedTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
                darkMode={darkMode}
              />

              <button
                onClick={generateShareableLink}
                disabled={!recipientName || !senderName}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-700 hover:to-purple-700"
              >
                <Share2 className="w-5 h-5" />
                Generate Shareable Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          shareableLink={shareableLink}
          recipientName={recipientName}
          onClose={() => setShowShareModal(false)}
          onCopy={copyToClipboard}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};