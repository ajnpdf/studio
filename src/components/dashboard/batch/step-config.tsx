
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Info, Settings2, Folder, Type, FileCode, CheckCircle2 } from 'lucide-react';
import { BatchFile } from './batch-container';

interface Props {
  op: string;
  files: BatchFile[];
  config: any;
  setConfig: (c: any) => void;
}

export function StepConfig({ op, files, config, setConfig }: Props) {
  const tokens = ['{filename}', '{index}', '{date}', '{format}', '{width}', '{height}'];

  const getPreviewName = () => {
    let name = config.namingPattern;
    name = name.replace('{filename}', 'Document');
    name = name.replace('{index}', '001');
    name = name.replace('{date}', '2025-01-15');
    name = name.replace('{format}', 'PDF');
    return name + '.pdf';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="lg:col-span-2 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">Operation Settings</h2>
          </div>
          
          <Card className="bg-card/40 backdrop-blur-xl border-white/5">
            <CardContent className="p-8 space-y-8">
              {/* Dynamic operation specific UI would go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Master Compression</Label>
                  <Slider defaultValue={[80]} max={100} />
                  <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                    <span>Smallest</span>
                    <span>Balanced</span>
                    <span>Best</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Output Format</Label>
                  <Select defaultValue="same">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue placeholder="Match Original" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="same">Match Original</SelectItem>
                      <SelectItem value="pdf">Universal PDF</SelectItem>
                      <SelectItem value="jpg">Standard JPEG</SelectItem>
                      <SelectItem value="png">Lossless PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tighter">Per-Format Overrides</p>
                  <p className="text-[10px] text-muted-foreground">Adjust settings independently for JPG, PNG, and PDF groups.</p>
                </div>
                <Switch 
                  checked={config.differentSettingsPerType} 
                  onCheckedChange={(v) => setConfig({...config, differentSettingsPerType: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">Naming & Destination</h2>
          </div>
          
          <Card className="bg-card/40 backdrop-blur-xl border-white/5">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Output Naming Pattern</Label>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-bold">PREVIEW: {getPreviewName()}</Badge>
                </div>
                <Input 
                  value={config.namingPattern} 
                  onChange={(e) => setConfig({...config, namingPattern: e.target.value})}
                  className="bg-white/5 border-white/10 font-bold h-12 text-lg"
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {tokens.map(t => (
                    <Button 
                      key={t} 
                      variant="outline" 
                      onClick={() => setConfig({...config, namingPattern: config.namingPattern + t})}
                      className="h-7 text-[9px] font-black border-white/5 bg-white/5 hover:bg-primary/20"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Target Folder</Label>
                  <Select defaultValue="default">
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-primary" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="default">Default Workspace</SelectItem>
                      <SelectItem value="clients">Client Deliverables</SelectItem>
                      <SelectItem value="archives">Archived Batches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 self-end h-11">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Skip errors</span>
                  <Switch checked={config.skipErrors} onCheckedChange={(v) => setConfig({...config, skipErrors: v})} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-4">Batch Overview</h3>
        <Card className="bg-primary/5 border-primary/20 shadow-none overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <FileCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xl font-black">{files.length}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Tasks</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase">Estimated Size</span>
                <span>~482 MB</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase">Estimated Time</span>
                <span>~5.5 mins</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase">Monthly Quota</span>
                <span className="text-emerald-500">-127 / 5000</span>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-yellow-500/80 leading-relaxed font-bold">
                Large batches may take several minutes. You can navigate away once the batch has started.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
