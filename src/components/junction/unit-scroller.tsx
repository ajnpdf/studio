"use client";

import React from 'react';
import { LogoSlider } from '@/components/ui/logo-slider';
import { ALL_UNITS } from './services-grid';
import { cn } from '@/lib/utils';

/**
 * AJN Unit Scroller - Showcase of 40+ System Services
 */
export function UnitScroller() {
  // Extract icons from ALL_UNITS and map to stylized Logo elements
  const toolLogos = ALL_UNITS.map((unit) => (
    <div 
      key={unit.id} 
      className="flex flex-col items-center gap-3 group"
    >
      <div className="w-16 h-16 bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:border-primary/40 group-hover:shadow-xl">
        <unit.icon className="w-8 h-8 text-slate-950" />
      </div>
      <span className="text-[9px] font-black text-slate-950/40 uppercase tracking-widest group-hover:text-primary transition-colors">
        {unit.name}
      </span>
    </div>
  ));

  // If we have fewer than 40, duplicate to fulfill the visual requirement
  const extendedLogos = toolLogos.length < 40 
    ? [...toolLogos, ...toolLogos].slice(0, 45) 
    : toolLogos;

  return (
    <div className="w-full space-y-4 py-8">
      <div className="px-8 mb-4">
        <div className="h-px w-full bg-black/5" />
      </div>
      
      <LogoSlider 
        logos={extendedLogos} 
        speed={80} 
        direction="left" 
      />

      <div className="px-8 mt-4">
        <div className="h-px w-full bg-black/5" />
      </div>
    </div>
  );
}
