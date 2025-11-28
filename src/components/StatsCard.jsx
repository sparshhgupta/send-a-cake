import React from 'react';

export const StatsCard = ({ value, label, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl p-4 text-center`}>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
    <p className="text-xs text-gray-600 mt-1">{label}</p>
  </div>
);