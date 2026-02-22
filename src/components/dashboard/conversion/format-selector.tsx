
"use client";

import { useMemo } from 'react';
import { ArrowRightLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Props {
  category: string;
  from: string;
  to: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  isLocked?: boolean;
}

/**
 * AJN Format Selector
 * Now supports a high-fidelity 'Locked' mode for dedicated tool pages.
 */
export function FormatSelector({ category, from, to, onFromChange, onToChange, isLocked = false }: Props) {
  const quickPills = useMemo(() => {
    if (isLocked) return [];
    if (category === 'Document') return ['PDF to DOCX', 'PDF to JPG', 'DOCX to PDF', 'XLSX to PDF'];
    if (category === 'Image') return ['JPG to PNG', 'PNG to WebP', 'HEIC to JPG', 'SVG to PNG'];
    if (category === 'Video') return ['MP4 to GIF', 'MP4 to MP3', 'MOV to MP4'];
    return [];
  }, [category, isLocked]);

  return (
    <section className="space-y-6 animate-in slide-in-from-top-4 duration-500 w-full">
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        {/* SOURCE FORMAT */}
        <div className="flex-1 w-full space-y-2 relative z-10">
          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Source Protocol</label>
          <div className="h-14 bg-background/40 border border-white/10 rounded-2xl flex items-center px-6 font-black text-sm uppercase text-white/90">
            {from || 'AUTO DETECT'}
            {isLocked && <Lock className="w-3 h-3 ml-auto text-primary/40" />}
          </div>
        </div>

        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-6 md:mt-0">
          <ArrowRightLeft className="w-5 h-5 text-primary/40" />
        </div>

        {/* TARGET FORMAT */}
        <div className="flex-1 w-full space-y-2 relative z-10">
          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Target Protocol</label>
          <div className="h-14 bg-background/40 border border-white/10 rounded-2xl flex items-center px-6 font-black text-sm uppercase text-primary">
            {to || 'SELECT TARGET'}
            {isLocked && <Lock className="w-3 h-3 ml-auto text-primary/40" />}
          </div>
        </div>
      </div>

      {!isLocked && quickPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            Top {category.toUpperCase()} Tools:
          </span>
          {quickPills.map(pill => (
            <button 
              key={pill}
              onClick={() => {
                const [f, t] = pill.split(' to ');
                onFromChange(f);
                onToChange(t);
              }}
              className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-muted-foreground hover:bg-primary hover:text-white transition-all uppercase tracking-widest"
            >
              {pill}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
