
"use client";

import { 
  MousePointer2, 
  Type, 
  ImageIcon, 
  Square, 
  RotateCw, 
  Trash2, 
  FileDown, 
  History, 
  Lock, 
  Search, 
  Plus, 
  Minus, 
  Undo2, 
  Redo2, 
  ChevronDown,
  Save,
  PenTool,
  CheckCircle2,
  Scissors
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
  onRotate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  docName: string;
  versions: PDFVersion[];
  onSave: () => void;
}

export function PDFToolbar({ 
  activeTool, 
  setActiveTool, 
  zoom, 
  setZoom, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  docName, 
  versions,
  onSave
}: Props) {
  const ToolButton = ({ tool, icon: Icon, label }: { tool: PDFTool, icon: any, label: string }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-9 w-9 rounded-lg transition-all",
              activeTool === tool ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
            )}
            onClick={() => setActiveTool(tool)}
          >
            <Icon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0 z-50">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 px-3 bg-white/5 rounded-xl border border-white/10 gap-3">
              <FileDown className="w-4 h-4 text-primary" />
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black uppercase truncate max-w-[120px]">{docName}</p>
                <p className="text-[8px] text-muted-foreground font-bold">V{versions.length} • MASTERED</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-card/90 backdrop-blur-xl border-white/10">
            <DropdownMenuItem className="gap-3 py-2.5">
              <History className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Revision History</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-2.5">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Encryption Layers</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="ghost" size="icon" disabled={!canUndo} onClick={onUndo} className="h-8 w-8 text-muted-foreground disabled:opacity-20"><Undo2 className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon" disabled={!canRedo} onClick={onRedo} className="h-8 w-8 text-muted-foreground disabled:opacity-20"><Redo2 className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8 bg-white/10" />

      {/* Tool Palette (Step 3) */}
      <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5">
        <ToolButton tool="select" icon={MousePointer2} label="Selection Tool (V)" />
        <ToolButton tool="add-text" icon={Type} label="Text Tool (T)" />
        <ToolButton tool="insert-image" icon={ImageIcon} label="Image Tool (I)" />
        <ToolButton tool="shape" icon={Square} label="Shape Tool (S)" />
      </div>

      <div className="flex items-center gap-1.5 ml-2">
        <ToolButton tool="signature" icon={PenTool} label="E-Sign Layer" />
        <ToolButton tool="form-field" icon={CheckCircle2} label="Smart Form" />
        <ToolButton tool="redact" icon={Scissors} label="Neural Redact" />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.max(25, zoom - 10))}><Minus className="w-3.5 h-3.5" /></Button>
          <span className="text-[10px] font-black w-12 text-center text-primary">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.min(400, zoom + 10))}><Plus className="w-3.5 h-3.5" /></Button>
        </div>

        <Button onClick={onSave} className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] h-10 px-6 rounded-xl uppercase tracking-widest shadow-xl gap-2">
          <Save className="w-3.5 h-3.5" /> Commit Changes
        </Button>
      </div>
    </header>
  );
}
