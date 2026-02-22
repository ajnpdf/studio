
"use client";

import { 
  MousePointer2, 
  Type, 
  ImageIcon, 
  Square, 
  Highlighter, 
  Underline, 
  Strikethrough, 
  MessageSquare,
  RotateCw,
  Trash2,
  FileDown,
  Printer,
  History,
  Lock,
  PenTool,
  Search,
  Maximize,
  ChevronDown,
  Plus,
  Scissors,
  Wand2,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { PDFTool } from './types';
import { cn } from '@/lib/utils';

interface Props {
  activeTool: PDFTool;
  setActiveTool: (tool: PDFTool) => void;
  zoom: number;
  setZoom: (z: number) => void;
  onRotate: (dir: 'cw' | 'ccw') => void;
  onDeletePage: () => void;
  docName: string;
}

export function PDFToolbar({ activeTool, setActiveTool, zoom, setZoom, onRotate, onDeletePage, docName }: Props) {
  const ToolButton = ({ tool, icon: Icon, label }: { tool: PDFTool, icon: any, label: string }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-9 w-9 rounded-lg transition-all",
              activeTool === tool ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
            onClick={() => setActiveTool(tool)}
          >
            <Icon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-card border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <header className="h-14 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center px-4 gap-4 shrink-0 z-50">
      {/* File Group */}
      <div className="flex items-center gap-1 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 cursor-default">
                <FileDown className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold truncate max-w-[120px]">{docName}</span>
                <ChevronDown className="w-3 h-3 opacity-40" />
              </div>
            </TooltipTrigger>
            <TooltipContent>Document Actions</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="ghost" size="icon" className="h-9 w-9"><Printer className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9"><History className="w-4 h-4" /></Button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Edit Group */}
      <div className="flex items-center gap-1">
        <ToolButton tool="select" icon={MousePointer2} label="Select" />
        <ToolButton tool="edit-text" icon={Type} label="Edit Text" />
        <ToolButton tool="insert-image" icon={ImageIcon} label="Insert Image" />
        <ToolButton tool="shape" icon={Square} label="Shapes" />
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Annotate Group */}
      <div className="flex items-center gap-1">
        <ToolButton tool="highlight" icon={Highlighter} label="Highlight" />
        <ToolButton tool="underline" icon={Underline} label="Underline" />
        <ToolButton tool="comment" icon={MessageSquare} label="Comment" />
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Page Group */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => onRotate('cw')}><RotateCw className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-red-400/10" onClick={onDeletePage}><Trash2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9"><Plus className="w-4 h-4" /></Button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Advanced Group */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9"><Lock className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-primary"><PenTool className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9"><Wand2 className="w-4 h-4" /></Button>
      </div>

      {/* View Group - Right Aligned */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1 border border-white/10">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.max(25, zoom - 10))}><Minus className="w-3 h-3" /></Button>
          <span className="text-[10px] font-black w-10 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.min(400, zoom + 10))}><Plus className="w-3 h-3" /></Button>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9"><Maximize className="w-4 h-4" /></Button>
        <Button className="bg-primary hover:bg-primary/90 font-bold h-9 px-4 shadow-lg shadow-primary/20">SAVE</Button>
      </div>
    </header>
  );
}
