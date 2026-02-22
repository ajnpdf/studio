"use client";

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings2, Wand2, Info, RefreshCw, Layers, ShieldCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  settings: any;
  setSettings: (s: any) => void;
}

export function SettingsPanel({ settings, setSettings }: Props) {
  return (
    <aside className="w-[320px] h-full border-l border-white/5 bg-background/20 backdrop-blur-xl flex flex-col shrink-0 z-30">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5" /> Neural Config
        </h3>
        <Badge variant="outline" className="text-[8px] font-black border-emerald-500/20 text-emerald-500 uppercase">Live Sync</Badge>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide">
        {/* Quality Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Mastery Factor
            </Label>
            <span className="text-xs font-black">{settings.quality}%</span>
          </div>
          <Slider 
            value={[settings.quality]} 
            max={100} 
            step={1}
            onValueChange={([v]) => setSettings({...settings, quality: v})}
          />
          <p className="text-[9px] text-muted-foreground uppercase font-bold text-center tracking-widest">Quality vs Compression Efficiency</p>
        </section>

        {/* Video Settings */}
        <section className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Resolution</Label>
          <Select value={settings.resolution} onValueChange={(v) => setSettings({...settings, resolution: v})}>
            <SelectTrigger className="h-11 bg-white/5 border-white/10 font-bold text-xs uppercase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4k">4K Ultra HD</SelectItem>
              <SelectItem value="1080p">1080p Full HD</SelectItem>
              <SelectItem value="720p">720p HD</SelectItem>
              <SelectItem value="480p">480p SD</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* OCR Language */}
        <section className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OCR Engine Language</Label>
          <Select value={settings.ocrLang} onValueChange={(v) => setSettings({...settings, ocrLang: v})}>
            <SelectTrigger className="h-11 bg-white/5 border-white/10 font-bold text-xs uppercase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'].map(l => (
                <SelectItem key={l} value={l.toLowerCase()} className="text-xs font-bold uppercase">{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Filename Template */}
        <section className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Output Template</Label>
          <Input 
            defaultValue="{name}_{format}_{date}" 
            className="h-11 bg-white/5 border-white/10 font-mono text-[10px] uppercase"
          />
          <div className="flex flex-wrap gap-1.5">
            {['{name}', '{format}', '{date}', '{index}'].map(t => (
              <Badge key={t} variant="secondary" className="bg-white/5 text-[8px] font-bold py-0.5 cursor-pointer hover:bg-primary/20">{t}</Badge>
            ))}
          </div>
        </section>

        {/* Privacy Toggles */}
        <section className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-white">Strip EXIF</p>
              <p className="text-[8px] text-muted-foreground uppercase">Remove metadata</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-white">Neural Cache</p>
              <p className="text-[8px] text-muted-foreground uppercase">Faster repeats</p>
            </div>
            <Switch />
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-white/5 bg-background/40">
        <div className="flex items-center gap-3 mb-4 text-muted-foreground/40">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Verified Local Processing</span>
        </div>
        <Button variant="ghost" onClick={() => setSettings({quality: 85, resolution: '1080p', ocrLang: 'eng'})} className="w-full text-[10px] font-black uppercase tracking-widest gap-2 text-muted-foreground hover:text-white">
          <RefreshCw className="w-3 h-3" /> Reset Session Params
        </Button>
      </div>
    </aside>
  );
}
