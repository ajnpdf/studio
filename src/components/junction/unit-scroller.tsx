"use client";

import React from 'react';
import { LogoSlider } from '@/components/ui/logo-slider';
import { ALL_UNITS } from './services-grid';
import { cn } from '@/lib/utils';

/**
 * AJN Unit Scroller - Modern Showcase
 * Features 40+ high-fidelity system units with interactive flow.
 * Refined for a compact, professional engineering look.
 */
export function UnitScroller() {
  // Map tools to compact glassmorphism tiles
  const toolLogos = ALL_UNITS.map((unit) => (
    <div 
      key={unit.id} 
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="w-14 h-14 bg-white/40 backdrop-blur-2xl border border-black/5 rounded-xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:bg-white/60">
        <unit.icon className="w-6 h-6 text-slate-950 transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="text-center">
        <span className="text-[8px] font-black text-slate-950 uppercase tracking-[0.1em] group-hover:text-primary transition-colors block leading-none">
          {unit.name}
        </span>
      </div>
    </div>
  ));

  // Ensure density for the marquee loop
  const extendedLogos = toolLogos.length < 40 
    ? [...toolLogos, ...toolLogos, ...toolLogos]
    : toolLogos;

  return (
    <div className="w-full py-1 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-2">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent" />
      </div>
      
      <LogoSlider 
        logos={extendedLogos} 
        speed={100} 
        direction="left" 
        pauseOnHover={true}
      />

      <div className="max-w-7xl mx-auto px-8 mt-2">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent" />
      </div>
    </div>
  );
}
