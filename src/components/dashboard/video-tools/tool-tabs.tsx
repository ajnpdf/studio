
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Repeat, 
  Shrink, 
  Scissors, 
  Music, 
  Maximize, 
  Type, 
  ImageIcon, 
  Wand2,
  Clock,
  Layers,
  Search,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Props {
  onProcess: (op: string, settings: any) => void;
}

export function ToolTabs({ onProcess }: Props) {
  const [activeTab, setActiveTab] = useState('convert');

  const ActionButton = ({ label }: { label: string }) => (
    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
        <Clock className="w-3 h-3" /> 
        Est. Time: ~15 seconds
      </div>
      <Button 
        onClick={() => onProcess(activeTab.toUpperCase(), {})}
        className="bg-brand-gradient hover:opacity-90 font-black text-xs px-8 shadow-xl shadow-primary/20 gap-2"
      >
        <Zap className="w-4 h-4" /> START {label.toUpperCase()}
      </Button>
    </div>
  );

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-white/5 px-2">
            <TabsList className="bg-transparent h-14 p-0 gap-2 overflow-x-auto scrollbar-hide flex justify-start">
              {[
                { id: 'convert', icon: Repeat, label: 'Convert' },
                { id: 'compress', icon: Shrink, label: 'Compress' },
                { id: 'trim', icon: Scissors, label: 'Trim' },
                { id: 'audio', icon: Music, label: 'Extract Audio' },
                { id: 'resize', icon: Maximize, label: 'Resize' },
                { id: 'watermark', icon: Type, label: 'Watermark' },
                { id: 'thumbnail', icon: ImageIcon, label: 'Thumbnail' },
              ].map((t) => (
                <TabsTrigger 
                  key={t.id} 
                  value={t.id} 
                  className="px-6 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary border-b-2 border-transparent transition-all text-[10px] font-bold uppercase tracking-widest gap-2"
                >
                  <t.icon className="w-3.5 h-3.5" /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-8">
            <TabsContent value="convert" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Output Format</Label>
                    <Select defaultValue="mp4">
                      <SelectTrigger className="bg-white/5 border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        {['MP4', 'MOV', 'AVI', 'MKV', 'WebM'].map(f => <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Video Codec</Label>
                    <Select defaultValue="h264">
                      <SelectTrigger className="bg-white/5 border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="h264">H.264 (AVC)</SelectItem>
                        <SelectItem value="h265">H.265 (HEVC)</SelectItem>
                        <SelectItem value="vp9">VP9</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Quality Preset</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Small', 'Balanced', 'High'].map(p => (
                        <Button key={p} variant="outline" className="h-11 text-[10px] font-bold border-white/10 bg-white/5 hover:bg-primary/20">{p}</Button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col gap-1">
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Est. Output Size</p>
                    <p className="text-sm font-black">~12.4 MB <span className="text-[10px] text-muted-foreground ml-2">(-72%)</span></p>
                  </div>
                </div>
              </div>
              <ActionButton label="Conversion" />
            </TabsContent>

            <TabsContent value="compress" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Target Resolution</Label>
                    <Select defaultValue="1080p">
                      <SelectTrigger className="bg-white/5 border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        {['4K', '1080p', '720p', '480p'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Compression Strength</Label>
                      <span className="text-xs font-black text-primary">70%</span>
                    </div>
                    <Slider defaultValue={[70]} max={100} step={1} />
                  </div>
                </div>
                <div className="space-y-4 flex flex-col justify-center">
                   <Button variant="outline" className="h-14 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary gap-3 rounded-2xl">
                      <Zap className="w-5 h-5" />
                      <div className="text-left">
                         <p className="text-xs font-black uppercase tracking-widest">Optimize for Web</p>
                         <p className="text-[9px] opacity-70">Best for YouTube, Instagram, Twitter</p>
                      </div>
                   </Button>
                </div>
              </div>
              <ActionButton label="Compression" />
            </TabsContent>

            <TabsContent value="trim" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="h-12 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden flex items-center px-4">
                   <div className="absolute inset-y-0 left-[20%] right-[40%] bg-primary/20 border-x-2 border-primary" />
                   <div className="w-full h-1 bg-white/10 rounded-full" />
                   <div className="absolute left-[20%] h-full w-0.5 bg-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">Start Time</Label>
                    <Input defaultValue="00:00:15.00" className="bg-white/5 border-white/10 font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">End Time</Label>
                    <Input defaultValue="00:01:22.00" className="bg-white/5 border-white/10 font-mono text-xs" />
                  </div>
                </div>
              </div>
              <ActionButton label="Trim & Cut" />
            </TabsContent>

            <TabsContent value="audio" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Audio Format</Label>
                  <Select defaultValue="mp3">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {['MP3', 'WAV', 'AAC', 'FLAC'].map(f => <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Bitrate</Label>
                  <Select defaultValue="320">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {['320 kbps', '192 kbps', '128 kbps'].map(b => <SelectItem key={b} value={b.split(' ')[0]}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ActionButton label="Extraction" />
            </TabsContent>

            <TabsContent value="resize" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Scaling Presets</Label>
                  <Select defaultValue="1080">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="2160">4K (3840×2160)</SelectItem>
                      <SelectItem value="1080">1080p (1920×1080)</SelectItem>
                      <SelectItem value="720">720p (1280×720)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Scale Mode</Label>
                  <Select defaultValue="fit">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="fit">Fit Inside</SelectItem>
                      <SelectItem value="fill">Fill & Crop</SelectItem>
                      <SelectItem value="stretch">Stretch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ActionButton label="Resizing" />
            </TabsContent>

            <TabsContent value="watermark" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Watermark Text</Label>
                    <Input placeholder="Enter text..." className="bg-white/5 border-white/10 h-11 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Opacity</Label>
                    <Slider defaultValue={[50]} max={100} />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Position</Label>
                  <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`aspect-square border border-white/10 bg-white/5 rounded cursor-pointer hover:bg-primary/20 ${i === 8 ? 'bg-primary/40 border-primary' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <ActionButton label="Watermark" />
            </TabsContent>

            <TabsContent value="thumbnail" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                   <p className="text-xs text-muted-foreground">Quickly capture frames or generate a set of thumbnails for your video.</p>
                   <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 font-bold gap-2">
                      <Wand2 className="w-4 h-4 text-primary" /> Capture Current Frame
                   </Button>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Auto-Generate Set</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[5, 10, 20].map(n => (
                      <Button key={n} variant="outline" className="h-10 text-xs font-bold border-white/10">{n} Frames</Button>
                    ))}
                  </div>
                </div>
              </div>
              <ActionButton label="Thumbnail" />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
