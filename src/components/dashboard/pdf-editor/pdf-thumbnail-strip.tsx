
"use client";

import { PDFPage } from './types';
import { cn } from '@/lib/utils';
import { MoreVertical, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  pages: PDFPage[];
  activeIdx: number;
  onSelect: (idx: number) => void;
}

export function PDFThumbnailStrip({ pages, activeIdx, onSelect }: Props) {
  return (
    <aside className="w-[180px] h-full border-r border-white/5 bg-background/20 backdrop-blur-xl flex flex-col shrink-0 overflow-y-auto scrollbar-hide">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Pages ({pages.length})</h3>
      </div>
      
      <div className="flex-1 p-4 space-y-6">
        {pages.map((page, idx) => (
          <div 
            key={page.id} 
            className="space-y-2 group"
            onClick={() => onSelect(idx)}
          >
            <div className={cn(
              "aspect-[1/1.4] bg-white/5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex items-center justify-center",
              activeIdx === idx ? "border-primary shadow-2xl shadow-primary/10" : "border-white/5 hover:border-white/20"
            )}>
              <div 
                className="w-4/5 h-4/5 bg-white/10 rounded shadow-sm flex flex-col gap-2 p-2"
                style={{ transform: `rotate(${page.rotation}deg)` }}
              >
                <div className="h-1 w-full bg-white/5 rounded-full" />
                <div className="h-1 w-4/5 bg-white/5 rounded-full" />
                <div className="h-1 w-full bg-white/5 rounded-full mt-auto" />
              </div>

              {/* Page Number Badge */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur rounded text-[8px] font-bold text-white border border-white/10">
                {idx + 1}
              </div>

              {/* Page Actions Overlay */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <Button size="icon" variant="ghost" className="h-6 w-6 bg-black/40 hover:bg-black/60 rounded-md">
                  <MoreVertical className="w-3 h-3 text-white" />
                </Button>
              </div>
            </div>
            <p className={cn(
              "text-[9px] font-bold text-center transition-colors uppercase tracking-widest",
              activeIdx === idx ? "text-primary" : "text-muted-foreground/40"
            )}>Page {idx + 1}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
