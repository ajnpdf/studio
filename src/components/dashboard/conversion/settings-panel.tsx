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
  'XLSX': ['PDF', 'CSV', 'XLS', 'ODS', 'HTML', 'JSON', 'XML'],
  'XLS': ['XLSX', 'CSV', 'PDF', 'HTML'],
  'CSV': ['XLSX', 'PDF', 'JSON', 'XML', 'TXT'],
  'JPG': ['PNG', 'WebP', 'AVIF', 'BMP', 'TIFF', 'PDF', 'SVG'],
  'PNG': ['JPG', 'WebP', 'AVIF', 'SVG', 'PDF'],
  'GIF': ['MP4', 'WebP', 'PNG', 'JPG'],
  'SVG': ['PNG', 'JPG', 'PDF', 'EPS'],
  'WEBP': ['JPG', 'PNG', 'TIFF'],
  'HEIC': ['JPG', 'PNG', 'WEBP'],
  'AVIF': ['JPG', 'PNG', 'WEBP'],
  'CR2': ['JPG', 'PNG', 'TIFF', 'DNG'],
  'NEF': ['JPG', 'PNG', 'TIFF', 'DNG'],
  'ARW': ['JPG', 'PNG', 'TIFF', 'DNG'],
  'DNG': ['JPG', 'PNG', 'TIFF'],
  'MP4': ['AVI', 'MOV', 'MKV', 'WEBM', 'GIF', 'MP3', 'WAV', 'AAC'],
  'MOV': ['MP4', 'GIF', 'AVI', 'MKV', 'WEBM'],
  'AVI': ['MP4', 'MOV', 'MKV'],
  'MKV': ['MP4', 'MOV', 'AVI'],
  'WEBM': ['MP4', 'MOV', 'MKV'],
  'FLV': ['MP4'],
  'WMV': ['MP4'],
  '3GP': ['MP4'],
  'TS': ['MP4'],
  'M4V': ['MP4'],
  'MP3': ['WAV', 'AAC', 'OGG', 'FLAC', 'M4A'],
  'PPTX': ['PDF', 'PPT', 'JPG', 'PNG', 'ODP'],
  'PPT': ['PPTX', 'PDF', 'JPG', 'PNG'],
  'ODT': ['PDF', 'DOCX', 'TXT', 'HTML'],
  'ODS': ['XLSX', 'CSV', 'PDF', 'HTML'],
  'ODP': ['PPTX', 'PDF', 'JPG', 'PNG'],
};

export function SettingsPanel({ file, settings, setSettings, onConvert, isProcessing }: Props) {
  const targets = conversionTargets[file.format.toUpperCase()] || ['PDF', 'JPG', 'PNG'];

  const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'AVIF', 'HEIC', 'BMP', 'SVG', 'GIF'].includes(file.format.toUpperCase());
  const isRaw = ['CR2', 'NEF', 'ARW', 'DNG'].includes(file.format.toUpperCase());
  const isVideo = ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM', 'FLV', 'WMV', '3GP', 'TS', 'M4V'].includes(file.format.toUpperCase());

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

            {(isImage || isRaw) && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-[9px] font-black uppercase tracking-widest">Quality Factor</Label>
                    <span className="text-xs font-black text-primary">{settings.qualityValue}%</span>
                  </div>
                  <Slider 
                    value={[settings.qualityValue]} 
                    max={100} 
                    onValueChange={([v]) => setSettings({...settings, qualityValue: v})} 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest">Target DPI</Label>
                  <Select value={settings.dpi} onValueChange={(v) => setSettings({...settings, dpi: v})}>
                    <SelectTrigger className="h-10 bg-white/5 border-white/10 font-black text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="72">72 DPI (Screen)</SelectItem>
                      <SelectItem value="150">150 DPI (Print)</SelectItem>
                      <SelectItem value="300">300 DPI (High-Res)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {isVideo && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest">Target Resolution</Label>
                  <Select value={settings.resolution} onValueChange={(v) => setSettings({...settings, resolution: v})}>
                    <SelectTrigger className="h-10 bg-white/5 border-white/10 font-black text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4k">4K (3840×2160)</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="480p">480p SD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest">Encoding Speed</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="h-10 bg-white/5 border-white/10 font-black text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultrafast">Ultrafast (Low Quality)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="veryslow">Very Slow (Max Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {file.format === 'PDF' && (
              <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <Checkbox id="ocr" checked={settings.ocr} onCheckedChange={(v) => setSettings({...settings, ocr: !!v})} />
                <div className="grid gap-1">
                  <Label htmlFor="ocr" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Enable OCR Engine</Label>
                  <p className="text-[9px] text-muted-foreground font-medium">Reconstruct editable text layers from scans.</p>
                </div>
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
            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Est. Latency: {isRaw || isVideo ? '15-60s' : '2-5s'}</span>
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
