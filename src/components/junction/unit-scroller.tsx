"use client";

import React from 'react';
import { LogoSlider } from '@/components/ui/logo-slider';
import { ALL_UNITS } from './services-grid';
import { cn } from '@/lib/utils';

/**
 * AJN Unit Scroller - Modern Showcase
 * Features 40+ high-fidelity system units with interactive flow.
 */
export function UnitScroller() {
  // Map tools to modern glassmorphism tiles
  const toolLogos = ALL_UNITS.map((unit) => (
    <div 
      key={unit.id} 
      className="flex flex-col items-center gap-4 group cursor-pointer"
    >
      <div className="w-20 h-20 bg-white/40 backdrop-blur-2xl border border-black/5 rounded-[2rem] flex items-center justify-center shadow-sm transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:bg-white/60">
        <unit.icon className="w-9 h-9 text-slate-950 transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="space-y-1 text-center">
        <span className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] group-hover:text-primary transition-colors block">
          {unit.name}
        </span>
        <span className="text-[8px] font-bold text-slate-950/30 uppercase tracking-widest block opacity-0 group-hover:opacity-100 transition-opacity">
          Ready
        </span>
      </div>
    </div>
  ));

  // Extend the list to ensure density for the marquee
  const extendedLogos = toolLogos.length < 40 
    ? [...toolLogos, ...toolLogos, ...toolLogos].slice(0, 45) 
    : toolLogos;

  return (
    <div className="w-full py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent" />
      </div>
      
      <LogoSlider 
        logos={extendedLogos} 
        speed={100} 
        direction="left" 
        pauseOnHover={true}
      />

      <div className="max-w-7xl mx-auto px-8 mt-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent" />
      </div>
    </div>
  );
}
