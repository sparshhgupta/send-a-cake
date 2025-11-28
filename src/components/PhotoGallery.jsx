import React from 'react';
import { Download } from 'lucide-react';

export const PhotoGallery = ({ photos, onDownload }) => {
  if (photos.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Birthday Photos 📸</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map(photo => (
          <div key={photo.id} className="relative group">
            <img src={photo.url} alt="Birthday moment" className="w-full h-32 object-cover rounded-xl shadow" />
            <button
              onClick={() => onDownload(photo)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};