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
 * Robust hydration fix: Returns null on initial server/client pass to sync attributes.
 */
export function NightSky() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
    setMounted(true);
  }, []);

  // Prevent hydration error by rendering nothing until client-side is ready
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-transparent">
      {/* Visual Ambient Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.1)_0%,transparent_60%)] opacity-50" />
      
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
    </div>
  );
}
