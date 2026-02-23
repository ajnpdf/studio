"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoSliderProps {
  logos: React.ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * AJN Logo Slider - Professional Modern Marquee
 * Hardware-accelerated infinite flow with interactive pause state.
 * Optimized for compact, high-fidelity layouts.
 */
export function LogoSlider({ 
  logos, 
  speed = 100, 
  direction = 'left',
  pauseOnHover = true,
  className 
}: LogoSliderProps) {
  // Triple logos to ensure a truly seamless infinite loop at high speeds
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className={cn(
      "relative w-full overflow-hidden py-4 select-none",
      className
    )}>
      {/* Professional Edge Fades - High Fidelity Masks */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />

      <div 
        className={cn(
          "flex items-center gap-10 w-max animate-marquee whitespace-nowrap",
          direction === 'right' && "animate-marquee-reverse",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{ 
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 flex items-center justify-center transition-all duration-700 hover:scale-110"
          >
            {logo}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse linear infinite;
        }
      `}</style>
    </div>
  );
}
