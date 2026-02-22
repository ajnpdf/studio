
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Wand2, Search, Settings2, Clock, Loader2 } from 'lucide-react';
import { ConversionSettings } from './conversion-engine';

interface Props {
  file: any;
  settings: ConversionSettings;
  setSettings: (s: any) => void;
  onConvert: () => void;
  isProcessing: boolean;
}

const conversionTargets: Record<string, string[]> = {
  'PDF': ['DOCX', 'XLSX', 'PPTX', 'JPG', 'PNG', 'TXT', 'HTML'],
  'JPG': ['PNG', 'WebP', 'AVIF', 'BMP', 'TIFF', 'PDF'],
  'PNG': ['JPG', 'WebP', 'AVIF', 'SVG', 'PDF'],
  'MP4': ['MOV', 'AVI', 'MKV', 'WebM', 'MP3', 'WAV'],
  'MP3': ['WAV', 'AAC', 'OGG', 'FLAC', 'M4A'],
};

export function SettingsPanel({ file, settings, setSettings, onConvert, isProcessing }: Props) {
  const targets = conversionTargets[file.format] || ['PDF', 'JPG', 'PNG'];

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 flex flex-col h-full min-h-0 overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Conversion Settings</h3>
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
          {/* Format Selection */}
          <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">From</Label>
              <div className="h-10 px-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-black text-sm">
                {file.format}
              </div>
            </div>
            
            <div className="mt-4">
              <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
            </div>

            <div className="space-y-1 flex-1">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">To Format</Label>
              <Select value={settings.toFormat} onValueChange={(v) => setSettings({...settings, toFormat: v})}>
                <SelectTrigger className="h-10 bg-white/5 border-white/10 font-bold">
                  <SelectValue placeholder="Select Target" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-xl border-white/10">
                  {targets.map(t => <SelectItem key={t} value={t} className="font-bold">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contextual Options */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Wand2 className="w-3 h-3" /> Output Configuration
            </h4>

            {file.format === 'PDF' && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <Label className="text-xs font-bold">Compression Quality</Label>
                  <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-3">
                    {['low', 'medium', 'high'].map(q => (
                      <Label key={q} className="flex flex-col items-center justify-between gap-2 p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
                        <RadioGroupItem value={q} className="sr-only" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{q}</span>
                        <span className="text-[9px] text-muted-foreground">
                          {q === 'low' ? 'Smallest' : q === 'high' ? 'Best' : 'Balanced'}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                  <Checkbox id="ocr" checked={settings.ocr} onCheckedChange={(v) => setSettings({...settings, ocr: !!v})} />
                  <div className="grid gap-1">
                    <Label htmlFor="ocr" className="text-xs font-bold cursor-pointer">Enable OCR Engine</Label>
                    <p className="text-[9px] text-muted-foreground">Extract text and make the document searchable.</p>
                  </div>
                </div>
              </div>
            )}

            {(file.format === 'JPG' || file.format === 'PNG') && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold">Image Quality</Label>
                    <span className="text-xs font-black text-primary">{settings.qualityValue}%</span>
                  </div>
                  <Slider 
                    value={[settings.qualityValue]} 
                    onValueChange={([v]) => setSettings({...settings, qualityValue: v})}
                    max={100}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                    <span>Smallest Size</span>
                    <span>Best Quality</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold">Output DPI</Label>
                  <Select value={settings.dpi} onValueChange={(v) => setSettings({...settings, dpi: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {['72', '96', '150', '300', '600'].map(d => <SelectItem key={d} value={d}>{d} DPI</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-xs font-bold">Output Filename</Label>
              <Input 
                value={settings.filename} 
                onChange={(e) => setSettings({...settings, filename: e.target.value})}
                placeholder="Enter filename"
                className="bg-white/5 border-white/10 font-bold h-11"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Est. Time: ~8 seconds</span>
            <span>Est. Size: 1.1 MB</span>
          </div>
          <Button 
            className="w-full h-12 bg-brand-gradient hover:opacity-90 shadow-xl shadow-primary/20 font-black text-sm gap-2"
            onClick={onConvert}
            disabled={isProcessing || !settings.toFormat}
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing Transformation...</>
            ) : (
              <><ArrowRight className="w-5 h-5" /> Convert Now</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
