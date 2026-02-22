"use client";

import { 
  MousePointer2, 
  Type, 
  ImageIcon, 
  Square, 
  Highlighter, 
  Underline, 
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
  Minus,
  CheckCircle2,
  LayoutGrid,
  Undo2,
  Redo2,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { PDFTool, PDFVersion } from './types';
import { cn } from '@/lib/utils';

interface Props {
  activeTool: PDFTool;
  setActiveTool: (tool: PDFTool) => void;
  zoom: number;
  setZoom: (z: number) => void;
  onRotate: (dir: 'cw' | 'ccw') => void;
  docName: string;
  versions: PDFVersion[];
}

export function PDFToolbar({ activeTool, setActiveTool, zoom, setZoom, onRotate, docName, versions }: Props) {
  const ToolButton = ({ tool, icon: Icon, label, shortcut }: { tool: PDFTool, icon: any, label: string, shortcut?: string }) => (
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
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            {shortcut && <span className="text-[9px] opacity-40 font-mono">{shortcut}</span>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0 z-50">
      {/* File & Version Control */}
      <div className="flex items-center gap-2 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 px-3 bg-white/5 rounded-xl border border-white/10 gap-3 hover:bg-white/10">
              <FileDown className="w-4 h-4 text-primary" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-tighter truncate max-w-[120px]">{docName}</p>
                <p className="text-[8px] text-muted-foreground font-bold uppercase">v{versions.length} • AUTO-SAVING</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-card/90 backdrop-blur-xl border-white/10">
            <DropdownMenuItem className="gap-3 py-2.5">
              <History className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Version History</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-2.5">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Security Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="gap-3 py-2.5 text-primary">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Publish to Vault</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-40"><Undo2 className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-40"><Redo2 className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8 bg-white/10" />

      {/* Editing Engine Group */}
      <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5">
        <ToolButton tool="select" icon={MousePointer2} label="Select Engine" shortcut="V" />
        <ToolButton tool="edit-text" icon={Type} label="Edit Layer" shortcut="T" />
        <ToolButton tool="insert-image" icon={ImageIcon} label="Asset Library" shortcut="I" />
        <ToolButton tool="shape" icon={Square} label="Geometry" shortcut="S" />
      </div>

      <Separator orientation="vertical" className="h-8 bg-white/10" />

      {/* Intelligence & Collaboration */}
      <div className="flex items-center gap-1.5">
        <ToolButton tool="signature" icon={PenTool} label="E-Sign Digital" />
        <ToolButton tool="form-field" icon={CheckCircle2} label="Smart Form" />
        <ToolButton tool="comment" icon={MessageSquare} label="Team Review" />
        <ToolButton tool="redact" icon={Scissors} label="Neural Redact" />
      </div>

      {/* View & Export Right Group */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1.5 border border-white/10 shadow-inner">
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/20" onClick={() => setZoom(Math.max(25, zoom - 10))}>
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[10px] font-black w-12 text-center text-primary">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/20" onClick={() => setZoom(Math.min(400, zoom + 10))}>
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] h-10 px-6 rounded-xl uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 transition-all hover:scale-105">
              EXPORT FILE <ChevronDown className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card/90 backdrop-blur-xl border-white/10">
            <div className="p-3">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2">Target Format</p>
              <div className="grid grid-cols-1 gap-1">
                {['Optimized PDF', 'Word Document', 'Lossless Images', 'Flattened PDF'].map(opt => (
                  <Button key={opt} variant="ghost" className="w-full justify-between h-9 text-[9px] font-bold uppercase hover:bg-primary/10">
                    {opt}
                    <Badge variant="outline" className="text-[7px] h-4 border-white/10 bg-white/5 opacity-60">PRO</Badge>
                  </Button>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
