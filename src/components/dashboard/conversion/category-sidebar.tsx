"use client";

import { 
  FileText, 
  ImageIcon, 
  Video, 
  Music, 
  Box, 
  Archive, 
  Code, 
  BookOpen, 
  Wand2, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'Document', icon: FileText, count: 42 },
  { id: 'Image', icon: ImageIcon, count: 30 },
  { id: 'Video', icon: Video, count: 18 },
  { id: 'Audio', icon: Music, count: 13 },
  { id: 'Archive', icon: Archive, count: 10 },
  { id: 'Code', icon: Code, count: 12 },
  { id: 'eBook', icon: BookOpen, count: 7 },
  { id: 'Design', icon: Wand2, count: 8 },
  { id: '3D/CAD', icon: Layers, count: 5 },
  { id: 'Specialized', icon: Box, count: 10 },
];

interface Props {
  active: string;
  onSelect: (id: string) => void;
}

export function CategorySidebar({ active, onSelect }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-full border-r border-white/5 bg-background/20 backdrop-blur-xl flex flex-col shrink-0 transition-all duration-300 z-30",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        {!collapsed && <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Categories</h3>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-6 w-6 text-muted-foreground ml-auto">
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all group relative",
              active === cat.id 
                ? "bg-primary text-white shadow-xl shadow-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <cat.icon className={cn(
              "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
              active === cat.id ? "text-white" : "text-muted-foreground"
            )} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left uppercase tracking-widest text-[10px]">{cat.id}</span>
                <span className={cn(
                  "text-[8px] font-black px-1.5 py-0.5 rounded-md",
                  active === cat.id ? "bg-white/20 text-white" : "bg-white/5 text-muted-foreground"
                )}>
                  {cat.count}
                </span>
              </>
            )}
            {active === cat.id && collapsed && (
              <div className="absolute right-0 top-3 bottom-3 w-1 bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className={cn(
          "bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col gap-3",
          collapsed && "items-center"
        )}>
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-emerald-500" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-[10px] font-black uppercase text-white">Neural Status</p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase">All Engines Optimal</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
