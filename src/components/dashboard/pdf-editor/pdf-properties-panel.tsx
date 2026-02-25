"use client";

import { PDFElement } from './types';
import { 
  Type, 
  Settings2, 
  Layers, 
  Palette, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <aside className="w-[280px] h-fit bg-white border border-black/10 shadow-2xl rounded-3xl overflow-hidden m-6 animate-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-slate-50 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Inspector</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-7 w-7 text-red-500 hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-5 space-y-6">
        {element.type === 'text' && (
          <div className="space-y-4">
            <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Font Family</Label>
            <Select value={element.fontFamily} onValueChange={(v) => handleFieldChange('fontFamily', v)}>
              <SelectTrigger className="h-9 text-xs font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Arial', 'Inter', 'Times New Roman', 'Courier'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { icon: Bold, key: 'bold', active: element.bold },
                { icon: Italic, key: 'italic', active: element.italic },
              ].map((btn, i) => (
                <Button 
                  key={i}
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8 rounded-md transition-all", btn.active ? "bg-white shadow-sm text-primary" : "text-slate-400")}
                  onClick={() => handleFieldChange(btn.key as any, !btn.active)}
                >
                  <btn.icon className="w-3.5 h-3.5" />
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
            <span>Opacity</span>
            <span className="text-primary">{Math.round((element.opacity || 1) * 100)}%</span>
          </div>
          <Slider value={[(element.opacity || 1) * 100]} max={100} onValueChange={([v]) => handleFieldChange('opacity', v / 100)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[8px] font-bold text-slate-400 uppercase">Width</Label>
            <Input type="number" value={Math.round(element.width)} onChange={(e) => handleFieldChange('width', parseInt(e.target.value))} className="h-8 text-[10px] font-bold" />
          </div>
          <div className="space-y-1">
            <Label className="text-[8px] font-bold text-slate-400 uppercase">Height</Label>
            <Input type="number" value={Math.round(element.height)} onChange={(e) => handleFieldChange('height', parseInt(e.target.value))} className="h-8 text-[10px] font-bold" />
          </div>
        </div>
      </div>
    </aside>
  );
}
