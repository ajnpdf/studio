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
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'Document', icon: FileText, label: 'Documents', color: 'text-blue-600' },
  { id: 'Image', icon: ImageIcon, label: 'Imagery', color: 'text-indigo-600' },
  { id: 'Video', icon: Video, label: 'Motion', color: 'text-purple-600' },
  { id: 'Audio', icon: Music, label: 'Audio', color: 'text-pink-600' },
  { id: 'Archive', icon: Archive, label: 'Archives', color: 'text-amber-600' },
  { id: 'Code', icon: Code, label: 'Data & Code', color: 'text-emerald-600' },
  { id: 'eBook', icon: BookOpen, label: 'Ebooks', color: 'text-cyan-600' },
  { id: 'Design', icon: Wand2, label: 'Design', color: 'text-orange-600' },
  { id: '3D/CAD', icon: Layers, label: 'Technical', color: 'text-red-600' },
  { id: 'Specialized', icon: Box, label: 'Specialized', color: 'text-slate-600' },
];

interface Props {
  active: string;
  onSelect: (id: string) => void;
}

/**
 * AJN Category Sidebar - Refined Light Professional Theme
 * Compact, proper case, and modern glassmorphism.
 */
export function CategorySidebar({ active, onSelect }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-full border-r border-black/5 bg-white/40 backdrop-blur-3xl flex flex-col shrink-0 transition-all duration-500 z-30 shadow-sm",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-5 border-b border-black/5 flex items-center justify-between">
        {!collapsed && <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Unit Cluster</h3>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)} 
          className="h-8 w-8 text-muted-foreground/60 hover:text-slate-900 hover:bg-black/5 ml-auto rounded-lg hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative",
              active === cat.id 
                ? "bg-primary text-white shadow-lg shadow-primary/10" 
                : "text-muted-foreground hover:bg-black/5 hover:text-slate-900"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
              active === cat.id ? "bg-white/20 text-white" : "bg-black/5"
            )}>
              <cat.icon className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110",
                active === cat.id ? "text-white" : cat.color
              )} />
            </div>
            
            {!collapsed && (
              <span className="flex-1 text-left font-black tracking-tight uppercase text-[10px]">{cat.label}</span>
            )}
            
            {active === cat.id && !collapsed && (
              <div className="w-1 h-1 rounded-full bg-white animate-pulse mr-1" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-black/5 bg-white/20">
        <div className={cn(
          "bg-white/60 rounded-2xl p-4 border border-white/80 flex flex-col gap-3 relative overflow-hidden shadow-sm",
          collapsed && "items-center px-2"
        )}>
          <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          
          {!collapsed && (
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase text-slate-900 leading-none">System Stable</p>
              <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Global Node Node</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
