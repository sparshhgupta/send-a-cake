import React from 'react';

export const ShareModal = ({ shareableLink, recipientName, onClose, onCopy }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">🎉 Your Birthday Cake is Ready!</h2>
      <p className="text-gray-600 mb-6">
        Share this link with <span className="font-semibold">{recipientName}</span> so they can blow out the candles!
      </p>
      
      <div className="bg-gray-100 p-4 rounded-xl mb-6 break-all">
        <code className="text-sm text-gray-800">{shareableLink}</code>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCopy}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Copy Link
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);