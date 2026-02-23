"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const loadingSteps = [
  "Inhaling AJN Engineering Core...",
  "Calibrating Neural UI Engine...",
  "Synchronizing Cloud Nodes...",
  "Provisioning Isolated Buffers...",
  "Bootstrapping WASM Pipeline...",
  "Optimizing Output Fidelity...",
  "Launching Master Platform..."
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
          setTimeout(() => setIsVisible(false), 800);
          return 100;
        }
        
        const nextPercent = prev + 1;
        if (nextPercent % 14 === 0 && textIndex < loadingSteps.length - 1) {
          setTextIndex(Math.floor(nextPercent / 14));
        }
        
        return nextPercent;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [textIndex]);

  if (!isVisible || !mounted) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 bg-[#e1b9fa]",
      isDone ? "opacity-0 pointer-events-none" : "opacity-100"
    )}>
      <div className="relative z-10 flex flex-col items-center">
        {/* AJN LOGO - Navy Blue High Fidelity */}
        <svg 
          viewBox="0 0 300 120" 
          className={cn(
            "w-[240px] mb-12 transition-all duration-1000",
            isDone && "scale-110 filter drop-shadow-[0_0_35px_rgba(30,58,138,0.4)]"
          )}
        >
          <defs>
            <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#000080" />
            </linearGradient>
          </defs>

          <g className="logo-paths">
            <path d="M20 100 L55 20 L90 100" className="logo-path" />
            <path d="M140 20 L140 80 Q140 105 115 100" className="logo-path delay-1" />
            <path d="M190 100 L190 20 L250 100 L250 20" className="logo-path delay-2" />
          </g>
        </svg>

        <div className="space-y-6 text-center">
          <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.5em] animate-pulse">
            {isDone ? "Protocol Established" : loadingSteps[textIndex]}
          </p>
          
          <div className="text-5xl font-black text-primary tracking-tighter tabular-nums">
            {percent}%
          </div>

          <div className="w-[300px] h-1.5 bg-black/5 rounded-full overflow-hidden mx-auto border border-black/5 shadow-inner">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_15px_rgba(30,58,138,0.5)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-path {
          fill: none;
          stroke: url(#loader-grad);
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw 1.2s ease forwards;
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }

        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
