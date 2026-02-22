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
import { ArrowRight, Wand2, Search, Settings2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { ConversionSettings } from './conversion-engine';

interface Props {
  file: any;
  settings: ConversionSettings;
  setSettings: (s: any) => void;
  onConvert: () => void;
  isProcessing: boolean;
}

const conversionTargets: Record<string, string[]> = {
  'PDF': [
    'DOCX', 'DOC', 'XLSX', 'XLS', 'PPTX', 'PPT', 
    'TXT', 'RTF', 'HTML', 'EPUB', 'JPG', 'PNG', 
    'TIFF', 'SVG', 'PDF/A', 'ODT', 'CSV', 'XML', 
    'JSON', 'Markdown'
  ],
  'DOCX': ['PDF', 'TXT', 'HTML', 'RTF', 'EPUB', 'ODT', 'JPG', 'PNG'],
  'DOC': ['DOCX', 'PDF', 'TXT', 'HTML'],
  'JPG': ['PNG', 'WebP', 'AVIF', 'BMP', 'TIFF', 'PDF', 'SVG'],
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
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Neural Config</h3>
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
          {/* Format Selection */}
          <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="space-y-1">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Source</Label>
              <div className="h-10 px-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-black text-sm uppercase">
                {file.format}
              </div>
            </div>
            
            <div className="mt-4">
              <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
            </div>

            <div className="space-y-1 flex-1">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Target Format</Label>
              <Select value={settings.toFormat} onValueChange={(v) => setSettings({...settings, toFormat: v})}>
                <SelectTrigger className="h-10 bg-white/5 border-white/10 font-black text-xs uppercase">
                  <SelectValue placeholder="Neural Target" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 max-h-[300px]">
                  {targets.map(t => <SelectItem key={t} value={t} className="font-bold text-[10px] uppercase tracking-widest">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contextual Options */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Wand2 className="w-3 h-3" /> Intelligent Parameters
            </h4>

            {file.format === 'DOC' && (
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-500 font-bold leading-relaxed">
                  Legacy DOC format detected. Complex layouts may be simplified during neural reconstruction.
                </p>
              </div>
            )}

            {(file.format === 'PDF' || file.format === 'DOCX') && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest">Processing Tier</Label>
                  <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-3">
                    {['low', 'medium', 'high'].map(q => (
                      <Label key={q} className="flex flex-col items-center justify-between gap-2 p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
                        <RadioGroupItem value={q} className="sr-only" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{q}</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">
                          {q === 'low' ? 'Draft' : q === 'high' ? 'High-Fi' : 'Standard'}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                {file.format === 'PDF' && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                    <Checkbox id="ocr" checked={settings.ocr} onCheckedChange={(v) => setSettings({...settings, ocr: !!v})} />
                    <div className="grid gap-1">
                      <Label htmlFor="ocr" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Enable OCR Engine</Label>
                      <p className="text-[9px] text-muted-foreground font-medium">Reconstruct editable text layers from scans.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest">Output Filename</Label>
              <Input 
                value={settings.filename} 
                onChange={(e) => setSettings({...settings, filename: e.target.value})}
                placeholder="Enter filename"
                className="bg-white/5 border-white/10 font-bold h-11 uppercase text-xs"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Est. Latency: 5-15s</span>
            <span>Neural V2.5 Active</span>
          </div>
          <Button 
            className="w-full h-12 bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 font-black text-[10px] uppercase tracking-[0.2em] gap-2"
            onClick={onConvert}
            disabled={isProcessing || !settings.toFormat}
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Neural Sync...</>
            ) : (
              <><ArrowRight className="w-5 h-5" /> Execute Mastery</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
