"use client";

import { ConversionJob, engine } from '@/lib/engine';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProgressSection({ jobs }: { jobs: ConversionJob[] }) {
  return (
    <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" /> Neural Queue ({jobs.length})
        </h3>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-card/40 backdrop-blur-xl border-white/5 overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                {job.status === 'processing' ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-black uppercase tracking-tighter truncate max-w-[240px]">{job.file.name}</p>
                    <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 text-[8px] font-black h-4 px-1.5 uppercase">
                      {job.fromFmt} → {job.toFmt}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{job.status === 'queued' ? 'Queued' : `${job.progress}%`}</span>
                </div>
                
                <Progress value={job.progress} className="h-1 bg-white/5 [&>div]:bg-white transition-all duration-500" />
                
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                  {job.stage}
                </p>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => engine.cancelJob(job.id)}
                className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
