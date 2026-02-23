"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoSliderProps {
  logos: React.ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

/**
 * AJN Logo Slider - Professional Infinite Marquee
 * Hardware-accelerated horizontal flow for service units.
 */
export function LogoSlider({ 
  logos, 
  speed = 40, 
  direction = 'left',
  className 
}: LogoSliderProps) {
  // Duplicate logos to ensure seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className={cn(
      "relative w-full overflow-hidden py-12 select-none",
      className
    )}>
      {/* Professional Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div 
        className={cn(
          "flex items-center gap-12 w-max animate-marquee whitespace-nowrap",
          direction === 'right' && "animate-marquee-reverse"
        )}
        style={{ 
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110">
            {logo}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
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
