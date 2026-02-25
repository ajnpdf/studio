
"use client";

import { PDFElement } from './types';
import { 
  Settings2, 
  Trash2, 
  Bold, 
  Italic, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Layers,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Props {
  element: PDFElement | null;
  onUpdate: (el: PDFElement) => void;
  onDelete: () => void;
}

export function PDFPropertiesPanel({ element, onUpdate, onDelete }: Props) {
  if (!element) return null;

  const handleFieldChange = (field: keyof PDFElement, value: any) => {
    onUpdate({ ...element, [field]: value });
  };

  return (
    <aside className="w-[300px] bg-white border border-black/10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden m-8 animate-in slide-in-from-right-10 duration-500 pointer-events-auto">
      <header className="p-5 bg-slate-50 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Inspector</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </header>

      <div className="p-6 space-y-8 overflow-y-auto scrollbar-hide max-h-[70vh]">
        {/* TEXT CONTROLS */}
        {element.type === 'text' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Typography</Label>
              <Select value={element.fontFamily} onValueChange={(v) => handleFieldChange('fontFamily', v)}>
                <SelectTrigger className="h-10 text-xs font-bold bg-slate-50 border-black/5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">{['Arial', 'Inter', 'Times New Roman', 'Courier'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-black/5">
                {[
                  { icon: AlignLeft, key: 'textAlign', val: 'left' },
                  { icon: AlignCenter, key: 'textAlign', val: 'center' },
                  { icon: AlignRight, key: 'textAlign', val: 'right' },
                ].map((btn, i) => (
                  <Button key={i} variant="ghost" className={cn("h-8 flex-1", element.textAlign === btn.val ? "bg-white shadow-sm text-primary" : "text-slate-400")} onClick={() => handleFieldChange('textAlign', btn.val)}>
                    <btn.icon className="w-3.5 h-3.5" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Size & Style</Label>
              <Slider value={[element.fontSize || 16]} min={8} max={120} onValueChange={([v]) => handleFieldChange('fontSize', v)} />
              <div className="flex gap-2">
                <Button variant="outline" className={cn("flex-1 h-9", element.bold && "bg-primary text-white border-primary")} onClick={() => handleFieldChange('bold', !element.bold)}><Bold className="w-3.5 h-3.5" /></Button>
                <Button variant="outline" className={cn("flex-1 h-9", element.italic && "bg-primary text-white border-primary")} onClick={() => handleFieldChange('italic', !element.italic)}><Italic className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        )}

        {/* SHAPE CONTROLS */}
        {element.type === 'shape' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Stroke Width</Label>
              <Slider value={[element.strokeWidth || 2]} min={0} max={20} onValueChange={([v]) => handleFieldChange('strokeWidth', v)} />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Colors</Label>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Stroke</span>
                  <input type="color" value={element.color || '#000000'} onChange={(e) => handleFieldChange('color', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Fill</span>
                  <input type="color" value={element.fillColor || '#transparent'} onChange={(e) => handleFieldChange('fillColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-black/5" />

        {/* DEPTH CONTROLS */}
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Depth Orchestration</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-9 gap-2 text-[9px] font-bold" onClick={() => handleFieldChange('zIndex', element.zIndex + 1)}><ChevronUp className="w-3 h-3" /> BRING FORWARD</Button>
            <Button variant="outline" className="h-9 gap-2 text-[9px] font-bold" onClick={() => handleFieldChange('zIndex', Math.max(0, element.zIndex - 1))}><ChevronDown className="w-3 h-3" /> SEND BACK</Button>
          </div>
        </div>

        {/* SPATIAL CONTROLS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
            <span>Opacity</span>
            <span>{Math.round((element.opacity || 1) * 100)}%</span>
          </div>
          <Slider value={[(element.opacity || 1) * 100]} max={100} onValueChange={([v]) => handleFieldChange('opacity', v / 100)} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase">Width</Label>
              <Input type="number" value={Math.round(element.width)} onChange={(e) => handleFieldChange('width', parseInt(e.target.value))} className="h-10 bg-slate-50 border-black/5 font-bold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase">Height</Label>
              <Input type="number" value={Math.round(element.height)} onChange={(e) => handleFieldChange('height', parseInt(e.target.value))} className="h-10 bg-slate-50 border-black/5 font-bold" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
