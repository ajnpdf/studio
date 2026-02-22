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
  ChevronDown,
  Trash2,
  Lock,
  Link as LinkIcon,
  CheckCircle2,
  Wand2,
  RotateCw,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface Props {
  element: PDFElement | null;
  onUpdate: (el: PDFElement) => void;
  onDelete: () => void;
}

export function PDFPropertiesPanel({ element, onUpdate, onDelete }: Props) {
  if (!element) {
    return (
      <aside className="w-[300px] h-full border-l border-white/5 bg-background/40 backdrop-blur-3xl flex flex-col shrink-0 items-center justify-center p-12 text-center opacity-40">
        <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-6">
          <Settings2 className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Layer Properties</h4>
          <p className="text-[10px] font-medium leading-relaxed">Select any object on the canvas to edit its neural attributes and metadata.</p>
        </div>
      </aside>
    );
  }

  const handleFieldChange = (field: keyof PDFElement, value: any) => {
    onUpdate({ ...element, [field]: value });
  };

  return (
    <aside className="w-[300px] h-full border-l border-white/5 bg-background/40 backdrop-blur-3xl flex flex-col shrink-0 overflow-y-auto scrollbar-hide">
      <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Inspector</h3>
          <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black tracking-widest">{element.type.toUpperCase()}</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-red-400 hover:bg-red-500/10 rounded-lg">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-6 space-y-10">
        {/* Transform Group */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Geometry Engine
            </Label>
            <span className="text-[8px] font-bold text-muted-foreground">ID: {element.id}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[8px] text-muted-foreground uppercase font-black">X-Pos</Label>
              <Input 
                type="number" 
                value={Math.round(element.x)} 
                onChange={(e) => handleFieldChange('x', parseInt(e.target.value))}
                className="h-10 bg-white/5 border-white/10 text-xs font-bold font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[8px] text-muted-foreground uppercase font-black">Y-Pos</Label>
              <Input 
                type="number" 
                value={Math.round(element.y)} 
                onChange={(e) => handleFieldChange('y', parseInt(e.target.value))}
                className="h-10 bg-white/5 border-white/10 text-xs font-bold font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[8px] text-muted-foreground uppercase font-black">Width</Label>
              <Input 
                type="number" 
                value={Math.round(element.width)} 
                onChange={(e) => handleFieldChange('width', parseInt(e.target.value))}
                className="h-10 bg-white/5 border-white/10 text-xs font-bold font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[8px] text-muted-foreground uppercase font-black">Height</Label>
              <Input 
                type="number" 
                value={Math.round(element.height)} 
                onChange={(e) => handleFieldChange('height', parseInt(e.target.value))}
                className="h-10 bg-white/5 border-white/10 text-xs font-bold font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span>Rotation</span>
              <span className="text-primary">{element.rotation || 0}°</span>
            </div>
            <Slider 
              value={[element.rotation || 0]} 
              max={360} 
              onValueChange={([v]) => handleFieldChange('rotation', v)} 
            />
          </div>
        </section>

        {/* Dynamic Contextual Panels */}
        {element.type === 'text' && (
          <section className="space-y-6 animate-in slide-in-from-right-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Type className="w-3.5 h-3.5" /> Typography Matrix
            </Label>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[8px] text-muted-foreground uppercase font-bold">Font Neural Profile</Label>
                <Select value={element.fontFamily} onValueChange={(v) => handleFieldChange('fontFamily', v)}>
                  <SelectTrigger className="h-10 bg-white/5 border-white/10 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    {['Inter', 'Arial', 'Helvetica', 'Caveat', 'Times New Roman'].map(f => (
                      <SelectItem key={f} value={f} className="text-xs font-medium">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span>Size</span>
                  <span className="text-primary">{element.fontSize}px</span>
                </div>
                <Slider 
                  value={[element.fontSize || 14]} 
                  max={120} 
                  min={6} 
                  onValueChange={([v]) => handleFieldChange('fontSize', v)}
                />
              </div>

              <div className="flex gap-1.5 p-1.5 bg-white/5 rounded-xl border border-white/5">
                {[
                  { icon: Bold, key: 'bold', active: element.bold },
                  { icon: Italic, key: 'italic', active: element.italic },
                  { icon: AlignLeft, key: 'align', val: 'left' },
                  { icon: AlignCenter, key: 'align', val: 'center' },
                  { icon: AlignRight, key: 'align', val: 'right' },
                ].map((btn, i) => (
                  <Button 
                    key={i}
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-9 w-9 rounded-lg transition-all", btn.active && "bg-primary text-white shadow-lg")}
                    onClick={() => handleFieldChange(btn.key as any, !btn.active)}
                  >
                    <btn.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {element.type === 'signature' && (
          <section className="space-y-6 animate-in slide-in-from-right-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> E-Sign Profile
            </Label>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest">Audit Trail Log</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest">Timestamp Overlay</span>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-primary/10" />
              <Button className="w-full bg-white text-black hover:bg-white/90 font-black text-[9px] uppercase h-10 gap-2">
                <RotateCw className="w-3 h-3" /> Re-Draw Signature
              </Button>
            </div>
          </section>
        )}

        {/* Universal Appearance */}
        <section className="space-y-6">
          <Label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Palette className="w-3.5 h-3.5" /> Layer Aesthetics
          </Label>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span>Layer Opacity</span>
                <span className="text-primary">{Math.round((element.opacity || 1) * 100)}%</span>
              </div>
              <Slider 
                value={[(element.opacity || 1) * 100]} 
                max={100} 
                onValueChange={([v]) => handleFieldChange('opacity', v / 100)}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-[8px] text-muted-foreground uppercase font-black">Neural Color Mapping</Label>
              <div className="flex flex-wrap gap-2">
                {['#000000', '#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#000080'].map(color => (
                  <button
                    key={color}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all hover:scale-125 hover:shadow-xl",
                      element.color === color ? "border-primary ring-2 ring-primary/20 scale-110" : "border-white/10"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleFieldChange('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 text-muted-foreground/40">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Object Locked by Owner</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground/40">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Visible to All Workspace Nodes</span>
          </div>
        </section>
      </div>

      <div className="mt-auto p-6 border-t border-white/5 bg-background/20">
        <Button className="w-full h-12 bg-white/5 hover:bg-red-500/10 text-red-400 border border-white/10 font-black text-[10px] uppercase tracking-widest gap-2 transition-all">
          <Trash2 className="w-4 h-4" /> Purge from Canvas
        </Button>
      </div>
    </aside>
  );
}
