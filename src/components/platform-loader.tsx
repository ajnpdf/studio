"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const loadingSteps = [
  "Preparing Buffers...",
  "Calibrating Tools...",
  "Syncing Workspace...",
  "Initializing Hub...",
  "Optimizing Output...",
  "Launching AJN..."
];

/**
 * AJN Platform Loader
 */
export function PlatformLoader() {
  const [percent, setPercent] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          setTimeout(() => setIsVisible(false), 800);
          return 100;
        }
        
        const nextPercent = prev + 1;
        if (nextPercent % 16 === 0 && textIndex < loadingSteps.length - 1) {
          setTextIndex(Math.floor(nextPercent / 16));
        }
        
        return nextPercent;
      });
    }, 12);

    return () => clearInterval(interval);
  }, [textIndex]);

  if (!mounted || !isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 bg-[#e1b9fa]",
      isDone ? "opacity-0 pointer-events-none" : "opacity-100"
    )}>
      <div className="relative z-10 flex flex-col items-center">
        <svg 
          viewBox="0 0 300 120" 
          className={cn(
            "w-[180px] mb-10 transition-all duration-1000",
            isDone && "scale-105 filter drop-shadow-[0_0_25px_rgba(30,58,138,0.4)]"
          )}
        >
          <defs>
            <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#000080" />
            </linearGradient>
          </defs>

          <g className="logo-paths">
            <path d="M20 100 L55 20 L90 100" fill="none" stroke="url(#loader-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 1.2s ease forwards' }} />
            <path d="M140 20 L140 80 Q140 105 115 100" fill="none" stroke="url(#loader-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 1.2s ease forwards 0.2s' }} />
            <path d="M190 100 L190 20 L250 100 L250 20" fill="none" stroke="url(#loader-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 1.2s ease forwards 0.4s' }} />
          </g>
        </svg>

        <div className="space-y-5 text-center">
          <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.5em] animate-pulse">
            {isDone ? "Established" : loadingSteps[textIndex]}
          </p>
          
          <div className="text-5xl font-black text-primary tracking-tighter tabular-nums leading-none">
            {percent}%
          </div>

          <div className="w-[240px] h-1.5 bg-black/5 rounded-full overflow-hidden mx-auto border border-black/5">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
