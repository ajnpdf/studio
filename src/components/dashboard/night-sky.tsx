"use client";

import React from 'react';

export function NightSky() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0a0e1f]">
      {/* Static subtle depth layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(30,58,138,0.12)_0%,transparent_60%),radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.08)_0%,transparent_70%)] opacity-70"></div>
      
      {/* Twinkling stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30 animate-[twinkle_linear_infinite]"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 3}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
