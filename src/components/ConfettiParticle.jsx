import React from 'react';

export const ConfettiParticle = ({ confetti }) => (
  <>
    {confetti.map(c => (
      <div
        key={c.id}
        className="absolute rounded-full z-50 pointer-events-none"
        style={{
          left: `${c.x}%`,
          top: `${c.y}%`,
          width: `${c.size}px`,
          height: `${c.size}px`,
          backgroundColor: c.color,
          transform: `rotate(${c.rotation}deg)`,
          transition: 'all 0.03s linear',
          opacity: 0.9
        }}
      />
    ))}
  </>
);