
"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Repeat, 
  Scissors, 
  Layers, 
  Volume2, 
  ShieldAlert, 
  Zap, 
  Clock, 
  Play,
  Waves,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface Props {
  onProcess: (op: string, settings: any) => void;
}

export function AudioToolTabs({ onProcess }: Props) {
  const [activeTab, setActiveTab] = useState('convert');

  const ActionButton = ({ label, icon: Icon = Zap }: { label: string, icon?: any }) => (
    <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-8">
      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
        <Clock className="w-3 h-3" /> 
        Est. Time: ~5-10 seconds
      </div>
      <Button 
        onClick={() => onProcess(activeTab.toUpperCase(), {})}
        className="bg-brand-gradient hover:opacity-90 font-black text-xs px-8 shadow-xl shadow-primary/20 gap-2"
      >
        <Icon className="w-4 h-4" /> PROCESS {label.toUpperCase()}
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
                { id: 'trim', icon: Scissors, label: 'Trim' },
                { id: 'merge', icon: Layers, label: 'Merge' },
                { id: 'normalize', icon: Volume2, label: 'Normalize' },
                { id: 'noise', icon: ShieldAlert, label: 'Noise Reduction' },
                { id: 'speed', icon: Zap, label: 'Speed' },
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
            {/* CONVERT TAB */}
            <TabsContent value="convert" className="m-0 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Output Format</Label>
                  <Select defaultValue="mp3">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {['MP3', 'WAV', 'AAC', 'FLAC', 'M4A', 'OGG'].map(f => <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>)}
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
                      {['128 kbps', '192 kbps', '256 kbps', '320 kbps'].map(b => <SelectItem key={b} value={b.split(' ')[0]}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Sample Rate</Label>
                  <Select defaultValue="44100">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="22050">22050 Hz</SelectItem>
                      <SelectItem value="44100">44100 Hz (CD)</SelectItem>
                      <SelectItem value="48000">48000 Hz (Studio)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ActionButton label="Conversion" />
            </TabsContent>

            {/* TRIM TAB */}
            <TabsContent value="trim" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase text-muted-foreground">Start Point</Label>
                      <Input defaultValue="00:00:05.00" className="bg-white/5 border-white/10 font-mono text-xs h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase text-muted-foreground">End Point</Label>
                      <Input defaultValue="00:05:30.00" className="bg-white/5 border-white/10 font-mono text-xs h-11" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <Scissors className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs font-bold">Precision Trim Mode</p>
                      <p className="text-[10px] text-muted-foreground">Fade in/out will be applied automatically.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Fade Durations (sec)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold"><span>FADE IN</span><span>1.5s</span></div>
                        <Slider defaultValue={[1.5]} max={5} step={0.1} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold"><span>FADE OUT</span><span>2.0s</span></div>
                        <Slider defaultValue={[2]} max={5} step={0.1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ActionButton label="Trim & Fades" />
            </TabsContent>

            {/* MERGE TAB */}
            <TabsContent value="merge" className="m-0 space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center font-black text-xs">1</div>
                    <div>
                      <p className="text-sm font-bold">Interview_Recording.mp3</p>
                      <p className="text-[10px] text-muted-foreground">Current Active File</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500 border-none">MASTER</Badge>
                </div>
                <Button variant="outline" className="w-full h-14 border-dashed border-white/10 bg-white/5 hover:bg-white/10 gap-3 text-muted-foreground font-bold">
                  <Plus className="w-5 h-5" /> ADD ANOTHER TRACK TO MERGE
                </Button>
                <div className="pt-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Cross-Fade Transition</Label>
                  <div className="flex items-center gap-6">
                    <Slider defaultValue={[3]} max={10} className="flex-1" />
                    <span className="text-xs font-black w-12 text-right">3.0s</span>
                  </div>
                </div>
              </div>
              <ActionButton label="Merge Tracks" icon={Layers} />
            </TabsContent>

            {/* NORMALIZE TAB */}
            <TabsContent value="normalize" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Target Loudness (LUFS)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { l: 'Podcast', v: '-16' },
                      { l: 'Streaming', v: '-14' },
                      { l: 'Broadcast', v: '-23' },
                      { l: 'Custom', v: '---' },
                    ].map((item) => (
                      <Button key={item.l} variant="outline" className="h-14 flex flex-col items-center justify-center border-white/10 bg-white/5 hover:border-primary/50 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.l}</span>
                        <span className="text-xs font-bold text-muted-foreground">{item.v} LUFS</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col justify-center space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase">Current Loudness</span>
                    <span className="text-white">-18.4 LUFS</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%]" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Waves className="w-4 h-4 text-primary animate-pulse" />
                    <p className="text-[10px] font-bold text-primary uppercase">Optimizing dynamic range...</p>
                  </div>
                </div>
              </div>
              <ActionButton label="Normalization" />
            </TabsContent>

            {/* NOISE REDUCTION TAB */}
            <TabsContent value="noise" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-yellow-500">
                    <ShieldAlert className="w-5 h-5" />
                    <h4 className="text-sm font-black uppercase tracking-widest">Step 1: Noise Profiling</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Select a section of "silence" or background-only noise on the waveform above, then click the profile button.
                  </p>
                  <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-[10px] uppercase h-9">
                    Learn Noise Profile
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Reduction Strength</Label>
                    <span className="text-xs font-black">75%</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} />
                  <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase tracking-widest pt-1">
                    <span>Subtle</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </div>
              <ActionButton label="Noise Removal" icon={Waves} />
            </TabsContent>

            {/* SPEED TAB */}
            <TabsContent value="speed" className="m-0 space-y-8 animate-in fade-in duration-300">
              <div className="max-w-2xl mx-auto space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Playback Speed Factor</Label>
                    <span className="text-xl font-black text-primary">1.25×</span>
                  </div>
                  <Slider defaultValue={[1.25]} min={0.25} max={4} step={0.05} className="py-4" />
                  <div className="flex justify-between gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                      <Button key={s} variant="ghost" className="flex-1 h-10 text-[10px] font-black border border-white/5 hover:bg-primary/20">{s}x</Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-tighter">Preserve Audio Pitch</p>
                    <p className="text-[10px] text-muted-foreground">Keep the voice natural while changing duration.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <ActionButton label="Speed Adjustment" />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
