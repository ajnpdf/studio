"use client";

import { useMemo } from 'react';
import { ArrowRightLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
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
 * AJN Format Selector - Advanced Input/Output Protocol Logic
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
    <section className="space-y-4 animate-in slide-in-from-top-4 duration-500 w-full">
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white/40 p-5 rounded-[2rem] border border-white/60 shadow-xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        {/* INPUT PROTOCOL */}
        <div className="flex-1 w-full space-y-1.5 relative z-10">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-3">Input Protocol</label>
          <div className="h-12 bg-black/5 border border-black/5 rounded-xl flex items-center px-5 font-black text-xs uppercase text-slate-900 group transition-all">
            {from || 'Analyzing Input...'}
            <Lock className="w-3 h-3 ml-auto text-primary/40 group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-white/60 border border-white/80 flex items-center justify-center shrink-0 mt-2 md:mt-4 shadow-sm">
          <ArrowRightLeft className="w-4 h-4 text-primary/40" />
        </div>

        {/* OUTPUT PROTOCOL */}
        <div className="flex-1 w-full space-y-1.5 relative z-10">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-3">Output Protocol</label>
          <Select value={to} onValueChange={onToChange}>
            <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-xl flex items-center px-5 font-black text-xs uppercase text-slate-900 focus:ring-primary/20 shadow-sm transition-all hover:border-primary/20">
              <SelectValue placeholder="SELECT TARGET" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-xl border-black/5 max-h-[300px] rounded-xl shadow-2xl">
              {targets.map(t => (
                <SelectItem key={t} value={t} className="text-[10px] font-black uppercase tracking-widest py-2.5 text-slate-900">
                  {t} Target
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isSourceLocked && quickPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-2">
          <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest mr-1">Presets:</span>
          {quickPills.map(pill => (
            <button 
              key={pill}
              onClick={() => {
                const [f, t] = pill.split(' to ');
                onFromChange(f);
                onToChange(t);
              }}
              className="px-3 py-1 bg-white/40 border border-white/60 rounded-full text-[9px] font-bold text-slate-900 hover:bg-primary hover:text-white transition-all uppercase tracking-widest shadow-sm"
            >
              {pill}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}