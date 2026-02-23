"use client";

import { useMemo } from 'react';
import { ArrowRightLeft, Lock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  category: string;
  from: string;
  to: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  isSourceLocked?: boolean;
}

/**
 * AJN Format Selector
 * Professional Protocol Management - Source is fixed, Target is dynamic.
 */
export function FormatSelector({ category, from, to, onFromChange, onToChange, isSourceLocked = false }: Props) {
  const targets = useMemo(() => {
    if (from === 'PDF') return ['DOCX', 'DOC', 'XLSX', 'XLS', 'PPTX', 'PPT', 'JPG', 'PNG', 'WEBP', 'TIFF', 'TXT', 'RTF', 'HTML', 'EPUB', 'JSON', 'XML', 'CSV', 'MD'];
    if (['JPG', 'PNG', 'WEBP', 'HEIC', 'TIFF'].includes(from)) return ['PDF', 'JPG', 'PNG', 'WEBP'];
    if (['DOCX', 'DOC', 'XLSX', 'XLS', 'PPTX', 'PPT'].includes(from)) return ['PDF'];
    return ['PDF'];
  }, [from]);

  const quickPills = useMemo(() => {
    if (isSourceLocked) return [];
    if (category === 'Document') return ['PDF to DOCX', 'PDF to JPG', 'DOCX to PDF', 'XLSX to PDF'];
    if (category === 'Image') return ['JPG to PNG', 'PNG to WebP', 'HEIC to JPG', 'SVG to PNG'];
    if (category === 'Video') return ['MP4 to GIF', 'MP4 to MP3', 'MOV to MP4'];
    return [];
  }, [category, isSourceLocked]);

  return (
    <section className="space-y-6 animate-in slide-in-from-top-4 duration-500 w-full">
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        {/* SOURCE PROTOCOL - LOCKED */}
        <div className="flex-1 w-full space-y-2 relative z-10">
          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Source Protocol</label>
          <div className="h-14 bg-background/40 border border-white/10 rounded-2xl flex items-center px-6 font-black text-sm uppercase text-white/90 group transition-all">
            {from || 'AUTO DETECT'}
            <Lock className="w-3.5 h-3.5 ml-auto text-primary/40 group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-6 md:mt-0">
          <ArrowRightLeft className="w-5 h-5 text-primary/40" />
        </div>

        {/* TARGET PROTOCOL - EDITABLE */}
        <div className="flex-1 w-full space-y-2 relative z-10">
          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Target Protocol</label>
          <Select value={to} onValueChange={onToChange}>
            <SelectTrigger className="h-14 bg-background/40 border border-white/10 rounded-2xl flex items-center px-6 font-black text-sm uppercase text-primary focus:ring-primary/40">
              <SelectValue placeholder="SELECT TARGET" />
            </SelectTrigger>
            <SelectContent className="bg-[#0d1225]/95 backdrop-blur-xl border-white/10 max-h-[300px]">
              {targets.map(t => (
                <SelectItem key={t} value={t} className="text-xs font-black uppercase tracking-widest py-3">
                  {t} PROTOCOL
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isSourceLocked && quickPills.length > 0 && (
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
