"use client";

import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const formatMap: Record<string, { from: string[], to: string[] }> = {
  Document: {
    from: ['PDF', 'DOCX', 'DOC', 'TXT', 'RTF', 'ODT', 'XLSX', 'CSV', 'PPTX'],
    to: ['PDF', 'DOCX', 'TXT', 'HTML', 'EPUB', 'JPG', 'PNG', 'XLSX', 'CSV', 'PPTX']
  },
  Image: {
    from: ['JPG', 'PNG', 'WebP', 'HEIC', 'AVIF', 'BMP', 'TIFF', 'SVG', 'CR2', 'NEF', 'ARW', 'DNG'],
    to: ['JPG', 'PNG', 'WebP', 'TIFF', 'PDF', 'SVG']
  },
  Video: {
    from: ['MP4', 'MOV', 'AVI', 'MKV', 'WebM', 'FLV', 'WMV', '3GP', 'TS', 'M4V'],
    to: ['MP4', 'AVI', 'MOV', 'MKV', 'WebM', 'GIF', 'MP3', 'WAV']
  },
  Audio: {
    from: ['MP3', 'WAV', 'AAC', 'M4A', 'FLAC', 'OGG', 'WMA', 'AIFF', 'AMR'],
    to: ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG']
  },
  Archive: {
    from: ['ZIP', 'RAR', '7Z', 'TAR', 'TAR.GZ', 'GZ', 'ISO', 'CAB'],
    to: ['ZIP', '7Z', 'ISO']
  },
  Code: {
    from: ['JSON', 'XML', 'CSV', 'YAML', 'HTML', 'MD', 'SQL'],
    to: ['JSON', 'XML', 'CSV', 'YAML', 'HTML', 'MD', 'PDF', 'DOCX', 'SQL']
  }
};

interface Props {
  category: string;
  from: string;
  to: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
}

export function FormatSelector({ category, from, to, onFromChange, onToChange }: Props) {
  const current = formatMap[category] || formatMap['Document'];
  const [swapping, setSwapping] = useState(false);

  const handleSwap = () => {
    setSwapping(true);
    const temp = from;
    onFromChange(to);
    onToChange(temp);
    setTimeout(() => setSwapping(false), 500);
  };

  const quickPills = useMemo(() => {
    if (category === 'Document') return ['PDF to DOCX', 'PDF to JPG', 'DOCX to PDF', 'XLSX to PDF'];
    if (category === 'Image') return ['JPG to PNG', 'PNG to WebP', 'HEIC to JPG', 'SVG to PNG'];
    if (category === 'Video') return ['MP4 to GIF', 'MP4 to MP3', 'MOV to MP4'];
    return [];
  }, [category]);

  return (
    <section className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex-1 w-full space-y-2 relative z-10">
          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Source Format</label>
          <Select value={from} onValueChange={onFromChange}>
            <SelectTrigger className="h-14 bg-background/40 border-white/10 rounded-2xl font-black text-sm uppercase px-6 focus:ring-primary/20">
              <SelectValue placeholder="AUTO DETECT" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 max-h-[300px]">
              {current.from.map(f => <SelectItem key={f} value={f} className="font-bold text-[10px] uppercase">{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <button 
          onClick={handleSwap}
          className={cn(
            "w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-primary hover:text-white shadow-xl group mt-6 shrink-0",
            swapping && "rotate-180"
          )}
        >
          <ArrowRightLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 w-full space-y-2 relative z-10">
          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Target Output</label>
          <Select value={to} onValueChange={onToChange}>
            <SelectTrigger className="h-14 bg-background/40 border-white/10 rounded-2xl font-black text-sm uppercase px-6 focus:ring-primary/20">
              <SelectValue placeholder="SELECT TARGET" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 max-h-[300px]">
              {current.to.map(f => <SelectItem key={f} value={f} className="font-bold text-[10px] uppercase">{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {quickPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Star className="w-3 h-3 text-primary fill-current" /> TOP {category.toUpperCase()} TASKS:
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
