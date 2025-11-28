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
  candleStates
}) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-500"
      style={{ backgroundColor: THEMES[selectedTheme].bg }}
    >
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-3 tracking-tight">
            Create Birthday Celebration
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-light">
            Design a personalized cake and share it with someone special
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-200">
            <CakeViewer
              candles={candles}
              onCandlesChange={setCandles}
              selectedTheme={selectedTheme}
              autoRotate={autoRotate}
              onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
              candleStates={candleStates}
              showControls={true}
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Edit3 className="w-6 h-6" />
              Customize
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message</label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Write a birthday wish..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none"
                />
              </div>

              <ThemeSelector 
                selectedTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
              />

              <button
                onClick={generateShareableLink}
                disabled={!recipientName || !senderName}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        />
      )}
    </div>
  );
};