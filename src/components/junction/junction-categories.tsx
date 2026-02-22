"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ImageIcon, Video, Music, ArrowRight, Zap, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const categories = [
  {
    id: 'Document',
    title: 'PDF Services Unit',
    count: '14 Units',
    desc: 'Advanced OOXML reconstruction, OCR layers, and archival processing.',
    icon: FileText,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    id: 'Image',
    title: 'Image Mastery',
    count: '12 Units',
    desc: 'RAW development, smart upscaling, and vector transformations.',
    icon: ImageIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10'
  },
  {
    id: 'Video',
    title: 'Video Lab Unit',
    count: '8 Units',
    desc: 'Hardware transcode, frame trimming, and codec surgery.',
    icon: Video,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    id: 'Audio',
    title: 'Audio Engine',
    count: '7 Units',
    desc: 'Compression, waveform precision, and dynamic normalization.',
    icon: Music,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10'
  }
];

export function JunctionCategories() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-10 md:space-y-16 relative">
      <section className="text-center space-y-4 md:space-y-6">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
          Network <br className="md:hidden" />
          <span className="text-primary/80">Junction</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-bold text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60 px-4">
          Access specialized service units for real-time infrastructure mastery.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
        {categories.map((cat) => (
          <Card 
            key={cat.id} 
            className="bg-white/[0.02] border-white/5 hover:border-primary/40 transition-all duration-500 group overflow-hidden rounded-[2rem] md:rounded-[3rem] border-2 shadow-2xl"
          >
            <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-6 md:space-y-10 relative">
              <div className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 blur-[60px] md:blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none",
                cat.bg
              )} />

              <div className="space-y-2 md:space-y-3 relative z-10">
                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 text-[7px] md:text-[9px] font-black uppercase tracking-widest px-3 h-5 md:h-6">
                  {cat.count} AVAILABLE
                </Badge>
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white group-hover:text-primary transition-colors">
                  {cat.title}
                </h2>
              </div>

              <div className={cn(
                "w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 relative z-10 shadow-2xl border border-white/5",
                cat.color
              )}>
                <cat.icon className="w-8 h-8 md:w-12 md:h-12" />
              </div>

              <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest leading-relaxed max-w-xs opacity-60">
                {cat.desc}
              </p>

              <Link href={`/junction/units?cat=${cat.id}`} className="relative z-10 w-full md:w-auto">
                <Button className="w-full md:w-auto h-12 md:h-14 px-8 md:px-10 bg-white text-black hover:bg-white/90 font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl md:rounded-2xl transition-all gap-3 shadow-2xl">
                  ACCESS UNIT <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
