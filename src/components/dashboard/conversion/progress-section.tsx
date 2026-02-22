"use client";

import { ConversionJob, engine } from '@/lib/engine';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Loader2, Clock, Zap, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProgressSection({ jobs }: { jobs: ConversionJob[] }) {
  return (
    <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4 text-primary animate-spin-slow" />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            Smart Task Queue ({jobs.length})
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-[#0d1225]/40 backdrop-blur-xl border-white/5 overflow-hidden group border-2">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden">
                {job.status === 'processing' ? (
                  <>
                    <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    <Loader2 className="w-6 h-6 text-primary animate-spin relative z-10" />
                  </>
                ) : (
                  <Clock className="w-6 h-6 text-muted-foreground/40" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-black uppercase tracking-tighter truncate max-w-[280px]">{job.file.name}</p>
                    <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 text-[8px] font-black h-4 px-2 uppercase tracking-widest">
                      {job.fromFmt} <span className="mx-1 opacity-40">→</span> {job.toFmt}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === 'processing' && <Zap className="w-3 h-3 text-primary animate-pulse" />}
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                      {job.status === 'queued' ? 'Awaiting slot' : `${job.progress}% COMPLETE`}
                    </span>
                  </div>
                </div>
                
                <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-brand-gradient transition-all duration-700 ease-out"
                    style={{ width: `${job.progress}%` }}
                  />
                  <div className="absolute inset-0 bg-shimmer pointer-events-none opacity-20" />
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest animate-pulse flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" /> {job.stage}
                  </p>
                  <span className="text-[8px] font-bold text-muted-foreground/40 uppercase">AJN CORE ENGINE v1.0</span>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => engine.cancelJob(job.id)}
                className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
