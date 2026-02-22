"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Wand2, Settings2, Clock, Loader2 } from 'lucide-react';
import { ConversionSettings } from './conversion-engine';

interface Props {
  file: any;
  settings: ConversionSettings;
  setSettings: (s: any) => void;
  onConvert: () => void;
  isProcessing: boolean;
}

const conversionTargets: Record<string, string[]> = {
  // Document Targets
  'PDF': ['DOCX', 'DOC', 'XLSX', 'XLS', 'PPTX', 'PPT', 'TXT', 'RTF', 'HTML', 'EPUB', 'JPG', 'PNG', 'TIFF', 'SVG', 'PDF/A', 'ODT', 'CSV', 'XML', 'JSON', 'Markdown'],
  'DOCX': ['PDF', 'TXT', 'HTML', 'RTF', 'EPUB', 'ODT', 'JPG', 'PNG'],
  'DOC': ['DOCX', 'PDF', 'TXT', 'HTML'],
  'XLSX': ['PDF', 'CSV', 'XLS', 'ODS', 'HTML', 'JSON', 'XML'],
  'CSV': ['XLSX', 'PDF', 'JSON', 'XML', 'TXT', 'SQL'],
  'JSON': ['XML', 'CSV', 'YAML', 'SQL', 'TXT'],
  'XML': ['JSON', 'CSV', 'TXT'],
  'YAML': ['JSON', 'CSV', 'TXT'],
  'YML': ['JSON', 'CSV', 'TXT'],
  'HTML': ['PDF', 'DOCX', 'TXT', 'PNG', 'JPG'],
  'MD': ['PDF', 'DOCX', 'HTML', 'TXT'],
  'MARKDOWN': ['PDF', 'DOCX', 'HTML', 'TXT'],
  'SQL': ['CSV', 'JSON', 'XML', 'TXT'],
  // Image Targets
  'JPG': ['PNG', 'WebP', 'AVIF', 'BMP', 'TIFF', 'PDF', 'SVG'],
  'PNG': ['JPG', 'WebP', 'AVIF', 'SVG', 'PDF'],
  'GIF': ['MP4', 'WebP', 'PNG', 'JPG'],
  'SVG': ['PNG', 'JPG', 'PDF', 'EPS'],
  // Audio Targets
  'MP3': ['WAV', 'AAC', 'OGG', 'FLAC', 'M4A'],
  'WAV': ['MP3', 'FLAC', 'AAC'],
  'FLAC': ['MP3', 'WAV'],
  'AAC': ['MP3', 'WAV'],
  // Video Targets
  'MP4': ['AVI', 'MOV', 'MKV', 'WEBM', 'GIF', 'MP3', 'WAV', 'AAC'],
  'MOV': ['MP4', 'GIF', 'AVI', 'MKV', 'WEBM'],
  // Archive Targets
  'ZIP': ['RAR', '7Z', 'TAR', 'ISO'],
  'RAR': ['ZIP'],
  '7Z': ['ZIP'],
  'TAR': ['ZIP'],
  'GZ': ['ZIP'],
  // Ebook Targets
  'EPUB': ['PDF', 'MOBI', 'DOCX', 'TXT'],
  'MOBI': ['EPUB'],
  'AZW': ['EPUB'],
  'AZW3': ['EPUB'],
  'FB2': ['EPUB'],
  // Design Targets
  'PSD': ['JPG', 'PNG', 'PDF'],
  'AI': ['PDF', 'SVG', 'PNG'],
  'EPS': ['SVG', 'PNG', 'JPG'],
};

export function SettingsPanel({ file, settings, setSettings, onConvert, isProcessing }: Props) {
  if (!file) {
    return (
      <Card className="bg-card/40 backdrop-blur-xl border-white/5 flex flex-col h-full min-h-0 overflow-hidden items-center justify-center p-12 text-center opacity-40">
        <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-6">
          <Settings2 className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Neural Calibration</h4>
          <p className="text-[10px] font-medium leading-relaxed">Load a source file to calibrate neural parameters and transformation paths.</p>
        </div>
      </Card>
    );
  }

  const targets = conversionTargets[file.format.toUpperCase()] || ['PDF', 'JPG', 'PNG'];

  const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'AVIF', 'HEIC', 'BMP', 'SVG', 'GIF', 'PSD', 'AI', 'EPS'].includes(file.format.toUpperCase());
  const isVideo = ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM', 'FLV', 'WMV', '3GP', 'TS', 'M4V'].includes(file.format.toUpperCase());
  const isAudio = ['MP3', 'WAV', 'AAC', 'M4A', 'FLAC', 'OGG', 'WMA', 'AIFF', 'AMR'].includes(file.format.toUpperCase());
  const isCode = ['JSON', 'XML', 'CSV', 'YAML', 'YML', 'HTML', 'MD', 'MARKDOWN', 'SQL'].includes(file.format.toUpperCase());

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 flex flex-col h-full min-h-0 overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Neural Config</h3>
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
          <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="space-y-1">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Source</Label>
              <div className="h-10 px-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-black text-sm uppercase">{file.format}</div>
            </div>
            <div className="mt-4"><ArrowRight className="w-6 h-6 text-primary animate-pulse" /></div>
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

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Wand2 className="w-3 h-3" /> Intelligent Parameters
            </h4>

            {isImage && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-[9px] font-black uppercase tracking-widest">Quality Factor</Label>
                    <span className="text-xs font-black text-primary">{settings.qualityValue}%</span>
                  </div>
                  <Slider value={[settings.qualityValue]} max={100} onValueChange={([v]) => setSettings({...settings, qualityValue: v})} />
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
                    <SelectContent><SelectItem value="4k">4K (3840×2160)</SelectItem><SelectItem value="1080p">1080p Full HD</SelectItem><SelectItem value="720p">720p HD</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {isAudio && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest">Bitrate</Label>
                  <Select value={settings.bitrate} onValueChange={(v) => setSettings({...settings, bitrate: v})}>
                    <SelectTrigger className="h-10 bg-white/5 border-white/10 font-black text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent><SelectItem value="128k">128 kbps (Mobile)</SelectItem><SelectItem value="192k">192 kbps (Standard)</SelectItem><SelectItem value="320k">320 kbps (Ultra)</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {isCode && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest">Indentation</Label>
                    <Select value={settings.indent.toString()} onValueChange={(v) => setSettings({...settings, indent: parseInt(v)})}>
                      <SelectTrigger className="h-10 bg-white/5 border-white/10 font-black text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Spaces</SelectItem>
                        <SelectItem value="4">4 Spaces</SelectItem>
                        <SelectItem value="0">Tab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {settings.toFormat === 'SQL' && (
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase tracking-widest">SQL Flavor</Label>
                      <Select value={settings.sqlFlavor} onValueChange={(v: any) => setSettings({...settings, sqlFlavor: v})}>
                        <SelectTrigger className="h-10 bg-white/5 border-white/10 font-black text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mysql">MySQL</SelectItem>
                          <SelectItem value="postgres">PostgreSQL</SelectItem>
                          <SelectItem value="sqlite">SQLite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
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
            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Est. Latency: {isVideo ? '30-120s' : '2-5s'}</span>
            <span>Neural V2.5 Active</span>
          </div>
          <Button 
            className="w-full h-12 bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 font-black text-[10px] uppercase tracking-[0.2em] gap-2"
            onClick={onConvert}
            disabled={isProcessing || !settings.toFormat}
          >
            {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Neural Sync...</> : <><ArrowRight className="w-5 h-5" /> Execute Mastery</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}