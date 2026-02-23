"use client";

import React from 'react';
import { LogoSlider } from '@/components/ui/logo-slider';
import { ALL_UNITS } from './services-grid';

/**
 * AJN Unit Scroller - Modern Showcase
 * Features 30+ high-fidelity system units with slow cinematic flow.
 */
export function UnitScroller() {
  const toolLogos = ALL_UNITS.map((unit) => (
    <div 
      key={unit.id} 
      className="flex flex-col items-center gap-3 group cursor-pointer"
    >
      <div className="w-14 h-14 bg-white/50 backdrop-blur-2xl border border-black/5 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-700 group-hover:border-primary/40 group-hover:bg-white/80 group-hover:shadow-xl">
        <unit.icon className="w-6 h-6 text-slate-950 transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="text-center">
        <span className="text-[9px] font-black text-slate-950/60 uppercase tracking-widest group-hover:text-primary transition-colors block leading-none">
          {unit.name}
        </span>
      </div>
    </div>
  ));

  return (
    <div className="w-full py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent" />
      </div>
      
      <LogoSlider 
        logos={toolLogos} 
        speed={180} 
        direction="left" 
        pauseOnHover={true}
      />

      <div className="max-w-7xl mx-auto px-8 mt-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent" />
      </div>
    </div>
  );
}
