"use client";

import React from 'react';

/**
 * AJN Neural Logo Animation
 * High-fidelity SVG path-draw and pulse animation for the landing page centerpiece.
 */
export function LogoAnimation() {
  return (
    <div className="relative flex justify-center items-center py-12 group select-none pointer-events-none">
      {/* Ambient background light */}
      <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow opacity-40" />
      
      <svg 
        viewBox="0 0 300 120" 
        className="w-[340px] md:w-[520px] transition-all duration-700 drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* A */}
        <path 
          d="M20 100 L55 20 L90 100" 
          className="logo-path"
        />

        {/* J */}
        <path 
          d="M140 20 L140 80 Q140 105 115 100" 
          className="logo-path delay-250"
        />

        {/* N */}
        <path 
          d="M190 100 L190 20 L250 100 L250 20" 
          className="logo-path delay-500"
        />
      </svg>

      <style jsx>{`
        .logo-path {
          fill: none;
          stroke: url(#logo-grad);
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw 1.6s ease forwards, pulse 3s ease-in-out infinite;
        }
        
        .delay-250 { animation-delay: 0.25s; }
        .delay-500 { animation-delay: 0.5s; }

        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulse {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(56,189,248,0.35));
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(99,102,241,0.55));
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
