"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ImageIcon, Video, Music, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const categories = [
  {
    id: 'Document',
    title: 'PDF Unit',
    count: '20+ Units',
    desc: 'Advanced OCR & processing.',
    icon: FileText,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    id: 'Image',
    title: 'Image Mastery',
    count: '15+ Units',
    desc: 'Upscaling & development.',
    icon: ImageIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10'
  },
  {
    id: 'Video',
    title: 'Video Lab',
    count: '8+ Units',
    desc: 'Hardware transcoding.',
    icon: Video,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    id: 'Audio',
    title: 'Audio Engine',
    count: '10+ Units',
    desc: 'Surgical track editing.',
    icon: Music,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10'
  }
];

export function JunctionCategories() {
  return (
    <div className="max-w-5xl mx-auto px-4 space-y-10 relative">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-white">
          Network <span className="text-primary/80">Junction</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto font-bold text-[9px] uppercase tracking-[0.3em] opacity-60">
          Specialized service units for engineering mastery.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card 
            key={cat.id} 
            className="bg-white/[0.02] border-white/5 hover:border-primary/40 transition-all duration-500 group overflow-hidden rounded-2xl border shadow-xl"
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-6 relative">
              <div className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none",
                cat.bg
              )} />

              <div className="space-y-1 relative z-10">
                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 text-[7px] font-black uppercase tracking-widest px-2 h-4">
                  {cat.count}
                </Badge>
                <h2 className="text-lg font-black tracking-tighter uppercase text-white group-hover:text-primary transition-colors">
                  {cat.title}
                </h2>
              </div>

              <div className={cn(
                "w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 relative z-10 shadow-lg border border-white/5",
                cat.color
              )}>
                <cat.icon className="w-6 h-6" />
              </div>

              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
                {cat.desc}
              </p>

              <Link href={`/junction/units?cat=${cat.id}`} className="relative z-10 w-full">
                <Button className="w-full h-10 px-4 bg-white text-black hover:bg-white/90 font-black text-[9px] uppercase tracking-widest rounded-lg transition-all gap-2 shadow-md">
                  Launch <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}