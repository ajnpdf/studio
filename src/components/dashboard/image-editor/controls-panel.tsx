
"use client";

import { ImageSettings } from './types';
import { 
  Settings2, 
  Maximize, 
  Shrink, 
  Crop, 
  Sparkles, 
  RotateCw, 
  Type, 
  Image as ImageIcon,
  Download,
  Wand2,
  Lock,
  Link as LinkIcon,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Props {
  settings: ImageSettings;
  setSettings: (s: ImageSettings) => void;
  onReset: () => void;
}

export function ControlsPanel({ settings, setSettings, onReset }: Props) {
  const updateSetting = (key: keyof ImageSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <aside className="flex-1 h-full bg-[#0a0e1f]/40 backdrop-blur-3xl overflow-y-auto scrollbar-hide border-r border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background/60 backdrop-blur-md z-10">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Optimization Controls</h3>
        <Settings2 className="w-3.5 h-3.5 text-muted-foreground/40" />
      </div>

      <div className="p-6 space-y-6">
        <Accordion type="multiple" defaultValue={['resize', 'compress']} className="space-y-4">
          
          {/* Resize Section */}
          <AccordionItem value="resize" className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Maximize className="w-4 h-4 text-blue-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">Resize Engine</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 space-y-6 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] text-muted-foreground font-bold uppercase">Width</Label>
                  <Input 
                    type="number" 
                    value={settings.width} 
                    onChange={(e) => updateSetting('width', parseInt(e.target.value))}
                    className="h-9 bg-white/5 border-white/10 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] text-muted-foreground font-bold uppercase">Height</Label>
                  <Input 
                    type="number" 
                    value={settings.height} 
                    onChange={(e) => updateSetting('height', parseInt(e.target.value))}
                    className="h-9 bg-white/5 border-white/10 font-bold"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold uppercase">Lock Aspect Ratio</span>
                </div>
                <Switch 
                  checked={settings.lockAspectRatio} 
                  onCheckedChange={(v) => updateSetting('lockAspectRatio', v)} 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[9px] text-muted-foreground font-bold uppercase">Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-8 text-[9px] font-bold border-white/10" onClick={() => updateSetting('width', 1920)}>WEB (1920)</Button>
                  <Select onValueChange={(v) => console.log(v)}>
                    <SelectTrigger className="h-8 text-[9px] font-bold bg-white/5 border-white/10">
                      <SelectValue placeholder="SOCIAL MEDIA" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="ig-post">Instagram Post</SelectItem>
                      <SelectItem value="ig-story">Instagram Story</SelectItem>
                      <SelectItem value="fb-cover">Facebook Cover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Compress Section */}
          <AccordionItem value="compress" className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Shrink className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">Compression</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 space-y-6 pt-2">
              <Tabs defaultValue="lossy" className="w-full">
                <TabsList className="grid grid-cols-2 h-9 bg-black/20 p-1 rounded-lg">
                  <TabsTrigger value="lossy" className="text-[10px] font-bold uppercase">Lossy</TabsTrigger>
                  <TabsTrigger value="lossless" className="text-[10px] font-bold uppercase">Lossless</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase">Quality</Label>
                  <span className="text-xs font-black text-primary">{settings.quality}%</span>
                </div>
                <Slider 
                  value={[settings.quality]} 
                  onValueChange={([v]) => updateSetting('quality', v)}
                  max={100}
                  step={1}
                />
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase text-emerald-500">ESTIMATED OUTPUT</p>
                  <p className="text-sm font-black">420 KB <span className="text-[10px] text-muted-foreground ml-2">(SAVES ~68%)</span></p>
                </div>
              </div>
              <Button className="w-full h-10 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-widest gap-2">
                <Sparkles className="w-3.5 h-3.5" /> RUN SMART COMPRESS
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Enhance Section */}
          <AccordionItem value="enhance" className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">AI Enhancements</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 space-y-6 pt-2">
              <div className="space-y-6">
                {['Brightness', 'Contrast', 'Saturation'].map((label) => (
                  <div key={label} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>{label}</span>
                      <span className="text-primary">{settings[label.toLowerCase() as keyof ImageSettings]}%</span>
                    </div>
                    <Slider 
                      value={[settings[label.toLowerCase() as keyof ImageSettings] as number]}
                      min={-100}
                      max={100}
                      onValueChange={([v]) => updateSetting(label.toLowerCase() as keyof ImageSettings, v)}
                    />
                  </div>
                ))}
                <Button variant="ghost" className="w-full h-8 text-[9px] font-bold text-muted-foreground hover:text-white" onClick={onReset}>
                  RESET ALL ENHANCEMENTS
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Background Tools */}
          <AccordionItem value="background" className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">Background AI</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 space-y-4 pt-2">
              <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 gap-2">
                <Wand2 className="w-4 h-4" /> REMOVE BACKGROUND (AI)
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-10 text-[9px] font-bold border-white/10 gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> REPLACE BG
                </Button>
                <div className="h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-white/20 bg-primary" />
                  <span className="text-[9px] font-bold">SOLID COLOR</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Watermark Section */}
          <AccordionItem value="watermark" className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-pink-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">Watermarking</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 space-y-6 pt-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] text-muted-foreground font-bold uppercase">Watermark Text</Label>
                  <Input 
                    value={settings.watermarkText} 
                    onChange={(e) => updateSetting('watermarkText', e.target.value)}
                    className="h-9 bg-white/5 border-white/10 font-bold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square border border-white/10 bg-white/5 rounded hover:bg-primary/20 cursor-pointer" />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span>Opacity</span>
                    <span className="text-primary">{settings.watermarkOpacity}%</span>
                  </div>
                  <Slider 
                    value={[settings.watermarkOpacity]} 
                    onValueChange={([v]) => updateSetting('watermarkOpacity', v)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      {/* Export Section Footer */}
      <div className="p-6 border-t border-white/5 bg-background/60 space-y-4 sticky bottom-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] text-muted-foreground font-bold uppercase">Format</Label>
            <Select value={settings.outputFormat} onValueChange={(v) => updateSetting('outputFormat', v)}>
              <SelectTrigger className="h-10 bg-white/5 border-white/10 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF', 'BMP'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] text-muted-foreground font-bold uppercase">Output DPI</Label>
            <Select value={settings.outputDpi.toString()} onValueChange={(v) => updateSetting('outputDpi', parseInt(v))}>
              <SelectTrigger className="h-10 bg-white/5 border-white/10 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {['72', '96', '150', '300', '600'].map(d => <SelectItem key={d} value={d}>{d} DPI</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">STRIP ALL EXIF METADATA</span>
          <Switch 
            checked={settings.stripMetadata} 
            onCheckedChange={(v) => updateSetting('stripMetadata', v)} 
          />
        </div>
      </div>
    </aside>
  );
}
