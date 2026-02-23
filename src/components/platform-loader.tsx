"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const loadingSteps = [
  "Initializing AJN Core...",
  "Loading UI Engine...",
  "Connecting to Cloud...",
  "Fetching User Data...",
  "Starting AI Modules...",
  "Optimizing Performance...",
  "Launching Platform..."
];

export function PlatformLoader() {
  const [percent, setPercent] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          setTimeout(() => setIsVisible(false), 800);
          return 100;
        }
        
        // Update text every ~14%
        const nextPercent = prev + 1;
        if (nextPercent % 14 === 0 && textIndex < loadingSteps.length - 1) {
          setTextIndex(Math.floor(nextPercent / 14));
        }
        
        return nextPercent;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [textIndex]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-500",
      isDone && "opacity-0 pointer-events-none"
    )}>
      {/* AJN LOGO */}
      <svg 
        viewBox="0 0 300 120" 
        className={cn(
          "w-[220px] mb-8 transition-all duration-700",
          isDone && "filter drop-shadow-[0_0_25px_#1e3a8a]"
        )}
      >
        <defs>
          <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#000080" />
          </linearGradient>
        </defs>

        <g className="logo-paths">
          {/* A */}
          <path d="M20 100 L55 20 L90 100" className="logo-path" />
          {/* J */}
          <path d="M140 20 L140 80 Q140 105 115 100" className="logo-path delay-1" />
          {/* N */}
          <path d="M190 100 L190 20 L250 100 L250 20" className="logo-path delay-2" />
        </g>
      </svg>

      <div className="space-y-4 text-center">
        <p className="text-[14px] font-bold text-white/80 uppercase tracking-[0.3em] animate-pulse">
          {isDone ? "Welcome to AJN Platform" : loadingSteps[textIndex]}
        </p>
        
        <div className="text-[28px] font-black bg-gradient-to-r from-[#1e3a8a] to-[#000080] bg-clip-text text-transparent">
          {percent}%
        </div>

        <div className="w-[260px] h-1.5 bg-[#0f172a] rounded-full overflow-hidden mx-auto border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-[#1e3a8a] to-[#000080] transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .logo-path {
          fill: none;
          stroke: url(#loader-grad);
          stroke-width: 5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw 1.5s ease forwards;
        }
        .delay-1 { animation-delay: 0.3s; }
        .delay-2 { animation-delay: 0.6s; }

        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
