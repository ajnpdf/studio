
"use client";

import { Wand2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ToolSuggestion {
  toolName: string;
  toolDescription: string;
  isRecommended: boolean;
}

export function ToolSuggestionCard({ tool }: { tool: ToolSuggestion }) {
  return (
    <div className={`p-4 rounded-2xl border-2 transition-all group hover:border-primary/50 cursor-pointer ${tool.isRecommended ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/5'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className={`p-2 rounded-xl ${tool.isRecommended ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground'}`}>
          <Wand2 className="w-4 h-4" />
        </div>
        {tool.isRecommended && (
          <Badge className="bg-primary/20 text-primary border-none text-[8px] h-4 font-black">RECOMMENDED</Badge>
        )}
      </div>
      <div className="space-y-1 mb-4">
        <h5 className="text-sm font-bold tracking-tight">{tool.toolName}</h5>
        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-1">{tool.toolDescription}</p>
      </div>
      <Button variant="ghost" className="w-full h-8 bg-white/5 hover:bg-primary hover:text-white border-none group-hover:bg-primary group-hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
        Launch Tool <ArrowRight className="w-3 h-3 ml-auto" />
      </Button>
    </div>
  );
}
