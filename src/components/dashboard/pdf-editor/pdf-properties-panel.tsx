
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
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Props {
  element: PDFElement | null;
  onUpdate: (el: PDFElement) => void;
}

export function PDFPropertiesPanel({ element, onUpdate }: Props) {
  if (!element) {
    return (
      <aside className="w-[240px] h-full border-l border-white/5 bg-background/20 backdrop-blur-xl flex flex-col shrink-0 items-center justify-center p-8 text-center opacity-40">
        <Settings2 className="w-12 h-12 mb-4 text-muted-foreground" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Select an element to view properties</p>
      </aside>
    );
  }

  const handleFieldChange = (field: keyof PDFElement, value: any) => {
    onUpdate({ ...element, [field]: value });
  };

  return (
    <aside className="w-[240px] h-full border-l border-white/5 bg-background/20 backdrop-blur-xl flex flex-col shrink-0 overflow-y-auto scrollbar-hide">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Properties</h3>
        <Badge variant="outline" className="text-[8px] border-primary/20 text-primary">{element.type.toUpperCase()}</Badge>
      </div>

      <div className="p-6 space-y-8">
        {/* Basic Transformation */}
        <section className="space-y-4">
          <Label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Layers className="w-3 h-3" /> Geometry
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[8px] text-muted-foreground uppercase font-bold">Width</Label>
              <Input 
                type="number" 
                value={Math.round(element.width)} 
                onChange={(e) => handleFieldChange('width', parseInt(e.target.value))}
                className="h-8 bg-white/5 border-white/10 text-xs font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[8px] text-muted-foreground uppercase font-bold">Height</Label>
              <Input 
                type="number" 
                value={Math.round(element.height)} 
                onChange={(e) => handleFieldChange('height', parseInt(e.target.value))}
                className="h-8 bg-white/5 border-white/10 text-xs font-bold"
              />
            </div>
          </div>
        </section>

        {/* Text Properties */}
        {element.type === 'text' && (
          <section className="space-y-4">
            <Label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Type className="w-3 h-3" /> Typography
            </Label>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[8px] text-muted-foreground uppercase font-bold">Font Family</Label>
                <Select value={element.fontFamily} onValueChange={(v) => handleFieldChange('fontFamily', v)}>
                  <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="Inter" className="text-xs">Inter</SelectItem>
                    <SelectItem value="Arial" className="text-xs">Arial</SelectItem>
                    <SelectItem value="Helvetica" className="text-xs">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman" className="text-xs">Times New Roman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[8px] text-muted-foreground uppercase font-bold">Size</Label>
                <div className="flex items-center gap-3">
                  <Slider 
                    value={[element.fontSize || 14]} 
                    max={72} 
                    min={8} 
                    step={1} 
                    onValueChange={([v]) => handleFieldChange('fontSize', v)}
                    className="flex-1"
                  />
                  <span className="text-[10px] font-black w-8 text-right">{element.fontSize}</span>
                </div>
              </div>

              <div className="flex gap-1 pt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn("h-8 w-8", element.bold && "bg-primary/20 text-primary border-primary/40")}
                  onClick={() => handleFieldChange('bold', !element.bold)}
                >
                  <Bold className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn("h-8 w-8", element.italic && "bg-primary/20 text-primary border-primary/40")}
                  onClick={() => handleFieldChange('italic', !element.italic)}
                >
                  <Italic className="w-3.5 h-3.5" />
                </Button>
                <Separator orientation="vertical" className="h-8 mx-1 bg-white/10" />
                <Button variant="ghost" size="icon" className="h-8 w-8"><AlignLeft className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><AlignCenter className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><AlignRight className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </section>
        )}

        {/* Visual Styling */}
        <section className="space-y-4">
          <Label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Palette className="w-3 h-3" /> Appearance
          </Label>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[8px] text-muted-foreground uppercase font-bold">Opacity</Label>
              <Slider 
                value={[(element.opacity || 1) * 100]} 
                max={100} 
                min={0} 
                step={1} 
                onValueChange={([v]) => handleFieldChange('opacity', v / 100)}
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-[8px] text-muted-foreground uppercase font-bold">Color</Label>
              <div className="flex flex-wrap gap-2">
                {['#ffffff', '#000000', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                  <button
                    key={color}
                    className={cn(
                      "w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125",
                      element.color === color && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleFieldChange('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <Button className="w-full h-10 bg-white/5 hover:bg-red-500/10 text-red-400 border border-white/10 font-bold text-[10px] uppercase tracking-widest">
          Delete Element
        </Button>
      </div>
    </aside>
  );
}
