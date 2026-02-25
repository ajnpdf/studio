
"use client";

import { PDFElement } from './types';
import { 
  Settings2, 
  Trash2, 
  Bold, 
  Italic, 
  Type, 
  Link as LinkIcon, 
  CheckSquare, 
  Globe,
  Lock,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Props {
  element: PDFElement | null;
  onUpdate: (el: PDFElement) => void;
  onDelete: () => void;
}

/**
 * AJN Advanced Object Inspector
 * Professional controls for Form Fields, Link Anchors, and Whiteout segments.
 */
export function PDFPropertiesPanel({ element, onUpdate, onDelete }: Props) {
  if (!element) return null;

  const handleFieldChange = (field: keyof PDFElement, value: any) => {
    onUpdate({ ...element, [field]: value });
  };

  return (
    <aside className="w-[300px] h-fit bg-white border border-black/10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden m-8 animate-in slide-in-from-right-10 duration-500">
      <header className="p-5 bg-slate-50/50 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Inspector</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl">
          <Trash2 className="w-4 h-4" />
        </Button>
      </header>

      <div className="p-8 space-y-8">
        {/* TEXT LAYER CONTROLS */}
        {element.type === 'text' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Typography</Label>
              <Select value={element.fontFamily} onValueChange={(v) => handleFieldChange('fontFamily', v)}>
                <SelectTrigger className="h-10 text-xs font-bold bg-slate-50 border-black/5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-black/5">
                  {['Arial', 'Inter', 'Times New Roman', 'Courier'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-black/5">
                {[
                  { icon: Bold, key: 'bold', active: element.bold },
                  { icon: Italic, key: 'italic', active: element.italic },
                ].map((btn, i) => (
                  <Button 
                    key={i}
                    variant="ghost" 
                    className={cn("h-9 flex-1 rounded-lg transition-all", btn.active ? "bg-white shadow-sm text-primary" : "text-slate-400")}
                    onClick={() => handleFieldChange(btn.key as any, !btn.active)}
                  >
                    <btn.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Point Size</Label>
              <Slider value={[element.fontSize || 14]} min={8} max={72} onValueChange={([v]) => handleFieldChange('fontSize', v)} />
            </div>
          </div>
        )}

        {/* LINK LAYER CONTROLS */}
        {element.type === 'link' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Globe className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Link Protocol</h4>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-bold text-slate-400 uppercase">Target URL</Label>
              <Input 
                value={element.url} 
                onChange={(e) => handleFieldChange('url', e.target.value)}
                placeholder="https://"
                className="h-10 bg-slate-50 border-black/5 rounded-xl font-bold text-xs"
              />
            </div>
          </div>
        )}

        {/* FORM FIELD CONTROLS */}
        {element.type === 'form-field' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-600">
              <CheckSquare className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Field Configuration</h4>
            </div>
            <div className="space-y-3">
              <Label className="text-[9px] font-bold text-slate-400 uppercase">Field Type</Label>
              <Select value={element.fieldType} onValueChange={(v) => handleFieldChange('fieldType', v)}>
                <SelectTrigger className="h-10 text-xs font-bold bg-slate-50 border-black/5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Input Text</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="radio">Radio Button</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black uppercase text-indigo-600">Required Field</span>
              </div>
              <input 
                type="checkbox" 
                checked={element.isRequired} 
                onChange={(e) => handleFieldChange('isRequired', e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
            </div>
          </div>
        )}

        {/* WHITEOUT CONTROLS */}
        {element.type === 'whiteout' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Palette className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Mask Protocol</h4>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['#FFFFFF', '#000000', '#FF0000', '#FFFF00'].map(c => (
                <button 
                  key={c}
                  onClick={() => handleFieldChange('color', c)}
                  className={cn("h-8 rounded-lg border border-black/10 transition-all", element.color === c && "ring-2 ring-primary ring-offset-2")}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        <Separator className="bg-black/5" />

        {/* SPATIAL DIMENSIONS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
            <span>Opacity</span>
            <span className="text-primary">{Math.round((element.opacity || 1) * 100)}%</span>
          </div>
          <Slider value={[(element.opacity || 1) * 100]} max={100} onValueChange={([v]) => handleFieldChange('opacity', v / 100)} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase">Width</Label>
              <Input type="number" value={Math.round(element.width)} onChange={(e) => handleFieldChange('width', parseInt(e.target.value))} className="h-10 bg-slate-50 border-black/5 font-bold text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-slate-400 uppercase">Height</Label>
              <Input type="number" value={Math.round(element.height)} onChange={(e) => handleFieldChange('height', parseInt(e.target.value))} className="h-10 bg-slate-50 border-black/5 font-bold text-xs" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
