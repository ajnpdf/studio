
"use client";

import { PDFPage } from './types';
import { cn } from '@/lib/utils';
import { MoreVertical, RotateCw, Trash2, Plus, GripVertical, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  pages: PDFPage[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  onReorder: (from: number, to: number) => void;
}

export function PDFThumbnailStrip({ pages, activeIdx, onSelect, onReorder }: Props) {
  return (
    <aside className="w-[220px] h-full border-r border-black/5 bg-white/40 backdrop-blur-xl flex flex-col shrink-0 z-30">
      <div className="p-4 border-b border-black/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Explorer ({pages.length})</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {pages.map((page, idx) => (
            <div 
              key={page.id} 
              className="space-y-3 group relative"
              onClick={() => onSelect(idx)}
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1">
                <GripVertical className="w-4 h-4 text-muted-foreground/40" />
              </div>

              <div className={cn(
                "aspect-[1/1.414] bg-white rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex items-center justify-center shadow-lg",
                activeIdx === idx 
                  ? "border-primary ring-4 ring-primary/10 scale-[1.02]" 
                  : "border-white/5 grayscale-[0.5] opacity-60 hover:border-white/20 hover:grayscale-0 hover:opacity-100"
              )}>
                {/* PDF PAGE PREVIEW */}
                {page.previewUrl ? (
                  <img 
                    src={page.previewUrl} 
                    className="w-full h-full object-cover transition-transform" 
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                    alt="" 
                  />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col gap-2 origin-center transition-transform" style={{ transform: `rotate(${page.rotation}deg)` }}>
                    <div className="h-2 w-1/2 bg-gray-100 rounded" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-gray-50 rounded" />
                      <div className="h-1 w-full bg-gray-50 rounded" />
                    </div>
                  </div>
                )}

                {/* Page Number Overlay */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur text-[9px] font-black text-white rounded border border-white/10 shadow-xl">
                  {idx + 1}
                </div>

                {/* Quick Actions Hover */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-1.5 animate-in slide-in-from-bottom-2">
                  <Button size="icon" variant="secondary" className="h-7 w-7 bg-black/60 backdrop-blur border border-white/10 rounded-lg hover:bg-primary hover:text-white">
                    <RotateCw className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-7 w-7 bg-black/60 backdrop-blur border border-white/10 rounded-lg hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              
              <p className={cn(
                "text-[9px] font-black text-center transition-colors uppercase tracking-[0.3em]",
                activeIdx === idx ? "text-primary" : "text-muted-foreground/40"
              )}>
                {idx === 0 ? 'COVER PAGE' : `SECTION ${idx}`}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5 bg-white/5 space-y-3">
        <Button variant="outline" className="w-full h-10 border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-primary/10 hover:text-primary transition-all">
          <Copy className="w-3.5 h-3.5" /> BULK EXTRACT
        </Button>
        <Button variant="ghost" className="w-full text-red-400 hover:bg-red-500/10 h-8 text-[8px] font-black uppercase tracking-[0.2em]">
          Clear Workspace
        </Button>
      </div>
    </aside>
  );
}
