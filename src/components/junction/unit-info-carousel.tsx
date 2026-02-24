"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Wand2, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoCard {
  title: string;
  desc: string;
  icon: any;
  color: string;
  step?: string;
}

const defaultCards: InfoCard[] = [
  {
    title: "Asset Ingestion",
    desc: "Load your files into the secure local memory buffer for analysis.",
    icon: Zap,
    color: "text-blue-600",
    step: "Step 1"
  },
  {
    title: "Configuration",
    desc: "Adjust parameters to achieve the precise output fidelity required.",
    icon: Wand2,
    color: "text-purple-600",
    step: "Step 2"
  },
  {
    title: "Process Execution",
    desc: "The system executes high-concurrency logic to finalize the transformation.",
    icon: Sparkles,
    color: "text-amber-600",
    step: "Step 3"
  },
  {
    title: "Secure Export",
    desc: "Retrieve your processed files immediately. No persistent data is retained.",
    icon: CheckCircle2,
    color: "text-emerald-600",
    step: "Step 4"
  }
];

/**
 * AJN Unit Info Carousel - High-Fidelity Guidance
 */
export function UnitInfoCarousel({ unitName }: { unitName?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    skipSnaps: false
  });

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="relative group/carousel">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-950/60">
            System Guidance: {unitName || "General Workflow"}
          </h3>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={scrollPrev} 
            className="h-7 w-7 rounded-lg hover:bg-black/5 text-slate-950/40 hover:text-slate-950"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={scrollNext} 
            className="h-7 w-7 rounded-lg hover:bg-black/5 text-slate-950/40 hover:text-slate-950"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {defaultCards.map((card, i) => (
            <Card 
              key={i} 
              className="flex-[0_0_280px] min-w-0 bg-white/40 backdrop-blur-xl border-white/60 shadow-lg hover:border-primary/20 transition-all group overflow-hidden"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={cn("w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shadow-sm", card.color)}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  {card.step && (
                    <span className="text-[10px] font-black text-slate-950/20 uppercase tracking-widest">{card.step}</span>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">{card.title}</h4>
                  <p className="text-[10px] leading-relaxed font-medium text-slate-950/60 uppercase tracking-wide">
                    {card.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
