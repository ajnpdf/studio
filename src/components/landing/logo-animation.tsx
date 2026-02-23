"use client";

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * AJN Tools Logo Animation
 * Updated to Navy Blue for a professional, high-fidelity brand presence.
 */
export function LogoAnimation({ className, showGlow = true }: { className?: string, showGlow?: boolean }) {
  return (
    <div className={cn("relative flex justify-center items-center select-none group", className)}>
      {/* Ambient background light */}
      {showGlow && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-[radial-gradient(circle,#1e3a8a_0%,transparent_70%)] opacity-[0.08] animate-bg-drift blur-3xl" />
        </div>
      )}
      
      <svg 
        viewBox="0 0 300 120" 
        className="w-full h-full transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95 z-10"
      >
        <defs>
          <linearGradient id="ajn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#000080" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>

        {/* AJN Paths with Staggered Smart Animation */}
        <g className="logo-paths">
          {/* A */}
          <path d="M20 100 L55 20 L90 100" className="logo-path" />
          
          {/* J */}
          <path d="M140 20 L140 80 Q140 105 115 100" className="logo-path delay-stagger-1" />
          
          {/* N */}
          <path d="M190 100 L190 20 L250 100 L250 20" className="logo-path delay-stagger-2" />
        </g>
      </svg>

      <style jsx>{`
        .logo-path {
          fill: none;
          stroke: url(#ajn-grad);
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
          
          /* Dash settings for draw animation */
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          
          /* Smart glow & animation pipeline - Navy Blue variant */
          filter: drop-shadow(0 0 6px rgba(30, 58, 138, 0.35));
          animation: 
            draw 1.6s ease forwards,
            pulse 3s ease-in-out infinite;
        }

        .delay-stagger-1 { animation-delay: 0.25s; }
        .delay-stagger-2 { animation-delay: 0.5s; }

        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulse {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(30, 58, 138, 0.35));
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(0, 0, 128, 0.55));
          }
        }

        /* Flowing gradient logic */
        #ajn-grad {
          animation: gradient-flow 5s linear infinite;
        }

        @keyframes gradient-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(200px); }
        }

        /* Ambient light movement */
        @keyframes bg-drift {
          0%, 100% { transform: translateY(-20px); }
          50% { transform: translateY(20px); }
        }
        .animate-bg-drift {
          animation: bg-drift 10s ease-in-out infinite;
        }

        /* Hover interactions */
        svg:hover .logo-path {
          stroke-width: 7;
          filter: drop-shadow(0 0 18px rgba(30, 58, 138, 0.9));
          transition: 0.4s;
        }
      `}</style>
    </div>
  );
}
