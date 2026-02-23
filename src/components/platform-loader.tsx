"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const loadingSteps = [
  "Inhaling Core...",
  "Calibrating Engine...",
  "Syncing Nodes...",
  "Provisioning Buffers...",
  "Bootstrapping WASM...",
  "Optimizing Output...",
  "Launching AJN..."
];

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
          setTimeout(() => setIsVisible(false), 600);
          return 100;
        }
        
        const nextPercent = prev + 1;
        if (nextPercent % 14 === 0 && textIndex < loadingSteps.length - 1) {
          setTextIndex(Math.floor(nextPercent / 14));
        }
        
        return nextPercent;
      });
    }, 12);

    return () => clearInterval(interval);
  }, [textIndex]);

  if (!mounted || !isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 bg-[#e1b9fa]",
      isDone ? "opacity-0 pointer-events-none" : "opacity-100"
    )}>
      <div className="relative z-10 flex flex-col items-center">
        <svg 
          viewBox="0 0 300 120" 
          className={cn(
            "w-[180px] mb-8 transition-all duration-700",
            isDone && "scale-105 filter drop-shadow-[0_0_20px_rgba(30,58,138,0.3)]"
          )}
        >
          <defs>
            <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#000080" />
            </linearGradient>
          </defs>

          <g className="logo-paths">
            <path d="M20 100 L55 20 L90 100" fill="none" stroke="url(#loader-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 1s ease forwards' }} />
            <path d="M140 20 L140 80 Q140 105 115 100" fill="none" stroke="url(#loader-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 1s ease forwards 0.15s' }} />
            <path d="M190 100 L190 20 L250 100 L250 20" fill="none" stroke="url(#loader-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 1s ease forwards 0.3s' }} />
          </g>
        </svg>

        <div className="space-y-4 text-center">
          <p className="text-[9px] font-black text-slate-950/40 uppercase tracking-[0.4em] animate-pulse">
            {isDone ? "Established" : loadingSteps[textIndex]}
          </p>
          
          <div className="text-4xl font-black text-primary tracking-tighter tabular-nums">
            {percent}%
          </div>

          <div className="w-[200px] h-1 bg-black/5 rounded-full overflow-hidden mx-auto border border-black/5">
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