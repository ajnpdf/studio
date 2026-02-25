"use client";

import { 
  MousePointer2, 
  Type, 
  ImageIcon, 
  Square, 
  Eraser, 
  MessageSquare, 
  Link as LinkIcon, 
  CheckSquare, 
  Undo2, 
  Redo2, 
  Save, 
  Minus, 
  Plus, 
  Settings2,
  Download,
  ChevronDown,
  PenTool
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  onSave
}: Props) {
  const ToolButton = ({ tool, icon: Icon, label }: { tool: PDFTool, icon: any, label: string }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "h-12 flex flex-col items-center justify-center gap-1 rounded-none px-4 transition-all border-b-2",
              activeTool === tool 
                ? "bg-slate-100 border-primary text-primary" 
                : "text-slate-600 border-transparent hover:bg-slate-50"
            )}
            onClick={() => setActiveTool(tool)}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-900 text-white border-none">
          <span className="text-[10px] font-bold uppercase tracking-widest">{label} Tool</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <header className="h-20 bg-white border-b border-black/10 flex flex-col shrink-0 z-50">
      <div className="flex-1 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled={!canUndo} onClick={onUndo} className="h-8 w-8 disabled:opacity-20"><Undo2 className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="icon" disabled={!canRedo} onClick={onRedo} className="h-8 w-8 disabled:opacity-20"><Redo2 className="w-3.5 h-3.5" /></Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-3 bg-slate-50 rounded-full px-3 py-1 border border-black/5">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.max(25, zoom - 10))}><Minus className="w-3 h-3" /></Button>
            <span className="text-[10px] font-black w-10 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.min(400, zoom + 10))}><Plus className="w-3 h-3" /></Button>
          </div>
        </div>

        <div className="flex items-center">
          <ToolButton tool="add-text" icon={Type} label="Text" />
          <ToolButton tool="link" icon={LinkIcon} label="Links" />
          <ToolButton tool="form-field" icon={CheckSquare} label="Forms" />
          <ToolButton tool="insert-image" icon={ImageIcon} label="Images" />
          <ToolButton tool="signature" icon={PenTool} label="Sign" />
          <ToolButton tool="redact" icon={Eraser} label="Whiteout" />
          <ToolButton tool="comment" icon={MessageSquare} label="Annotate" />
          <ToolButton tool="shape" icon={Square} label="Shapes" />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={onSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] h-10 px-8 rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 gap-2">
            <Download className="w-3.5 h-3.5" /> Apply Changes
          </Button>
        </div>
      </div>
    </header>
  );
}