
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, RefreshCw, CheckCircle2, Wand2 } from 'lucide-react';
import { ConversionState, ConversionSettings } from './conversion-engine';
import { ConversionResult } from '@/lib/converters/pdf-converter';

interface Props {
  state: ConversionState;
  progress: number;
  statusMessage?: string;
  file: any;
  settings: ConversionSettings;
  result: ConversionResult | null;
  onReset: () => void;
}

export function OutputPanel({ state, progress, statusMessage, file, settings, result, onReset }: Props) {
  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 flex flex-col h-full min-h-0 overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Output Result</h3>
          {state === 'complete' && <Badge className="bg-white/10 text-white border-none font-bold text-[9px]">READY</Badge>}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 min-h-0">
          {state === 'idle' && (
            <div className="space-y-6 opacity-40 animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mx-auto">
                <FileIcon className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-sm uppercase tracking-widest">Waiting for input</h4>
                <p className="text-[10px] text-muted-foreground max-w-[200px] mx-auto uppercase tracking-widest font-bold">Configure parameters & trigger mastery</p>
              </div>
            </div>
          )}

          {state === 'processing' && (
            <div className="w-full max-w-[280px] space-y-8 animate-in fade-in duration-300">
              <div className="relative">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border-2 border-white/10 flex items-center justify-center mx-auto relative overflow-hidden group">
                   <div className="absolute inset-0 bg-white/10 animate-pulse" style={{ height: `${progress}%`, bottom: 0, top: 'auto' }} />
                   <Wand2 className="w-10 h-10 text-white relative z-10" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="text-left space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Neural Processing</p>
                    <p className="text-sm font-bold">{progress}% Complete</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">AJN Core</p>
                </div>
                <Progress value={progress} className="h-1 bg-white/5 [&>div]:bg-white" />
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed animate-pulse font-black uppercase tracking-widest">
                {statusMessage || 'Analyzing session vectors...'}
              </p>
            </div>
          )}

          {state === 'complete' && (
            <div className="w-full space-y-8 animate-in zoom-in-95 fade-in duration-500">
              <div className="relative group">
                <div className="w-32 h-32 bg-white/5 rounded-[3rem] border-2 border-white/10 flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                   <Badge className="bg-white text-black border-none font-black text-[10px] px-3 h-6 shadow-xl uppercase tracking-widest">SUCCESS</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-xl tracking-tighter truncate px-4 uppercase">{result?.fileName || 'output_file'}</h4>
                <div className="flex items-center justify-center gap-2">
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verified Session Output</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 px-4">
                <Button 
                  onClick={handleDownload}
                  className="w-full h-14 bg-white text-black hover:bg-white/90 font-black gap-2 shadow-xl text-xs uppercase tracking-widest"
                >
                  <Download className="w-4 h-4" /> Download Result
                </Button>
                <Button variant="outline" className="h-11 border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest gap-2" onClick={onReset}>
                  <RefreshCw className="w-4 h-4" /> New Session Task
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
