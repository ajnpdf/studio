
"use client";

import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

export function NightSky() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // defer state update to after hydration to prevent mismatch
    const generatedStars = [...Array(35)].map((_, i) => ({
      id: i,
      width: `${Math.random() * 1.5 + 0.8}px`,
      height: `${Math.random() * 1.5 + 0.8}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0a0e1f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(30,58,138,0.15)_0%,transparent_60%),radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-70"></div>
      
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-[#f0f9ff] rounded-full opacity-30 animate-twinkle"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              boxShadow: '0 0 4px #e0f2fe, 0 0 10px #93c5fd',
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-twinkle {
          animation: twinkle linear infinite;
        }
      `}</style>
    </div>
  );
}
