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

/**
 * AJN Night Sky - Optimized for Light Background
 * Stars now twinkle with a violet glow over the platform gradient.
 * Fixed Hydration Error via mounted state check.
 */
export function NightSky() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generatedStars = [...Array(35)].map((_, i) => ({
      id: i,
      width: `${Math.random() * 1.5 + 1.2}px`,
      height: `${Math.random() * 1.5 + 1.2}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(generatedStars);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-transparent" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.1)_0%,transparent_60%)] opacity-50"></div>
      
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full opacity-40 animate-twinkle shadow-[0_0_8px_rgba(139,92,246,0.5)]"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle linear infinite;
        }
      `}</style>
    </div>
  );
}
