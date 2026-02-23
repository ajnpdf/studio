
"use client";

import { ProcessingJob, engine } from '@/lib/engine';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Loader2, Clock, Cpu, Terminal, ChevronDown, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * AJN Progress Section — Master Architecture
 * Features Flip-Fade Text logs and Multi-Stage indicators.
 */
export function ProgressSection({ jobs }: { jobs: ProcessingJob[] }) {
  const [showLogs, setShowLogs] = useState<Record<string, boolean>>({});

  const toggleLogs = (id: string) => {
    setShowLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="space-y-4 text-slate-950">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            Active System Queue ({jobs.length})
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Card className="bg-white/40 backdrop-blur-xl border-black/5 overflow-hidden group border shadow-xl">
                <CardContent className="p-0">
                  <div className="p-5 flex items-center gap-6">
                    <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center shrink-0 border border-black/5 relative overflow-hidden">
                      {job.status === 'running' ? (
                        <>
                          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                          <Loader2 className="w-6 h-6 text-primary animate-spin relative z-10" />
                        </>
                      ) : (
                        <Clock className="w-6 h-6 text-slate-950/20" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-black tracking-tight truncate max-w-[280px] text-slate-950 uppercase">
                            {job.inputs.length === 1 ? job.inputs[0].name : `${job.inputs.length} Assets for Assembly`}
                          </p>
                          <Badge variant="outline" className="bg-black/5 text-slate-950/60 border-black/10 text-[8px] font-black h-4 px-2 tracking-widest uppercase">
                            {job.mode} Mode
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">
                            {job.progress}% Complete
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          transition={{ type: "spring", stiffness: 50, damping: 20 }}
                          className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(30,58,138,0.3)]"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          <p className="text-[9px] font-black text-slate-950 uppercase tracking-widest leading-none">
                            {job.stage}
                          </p>
                        </div>
                        <button 
                          onClick={() => toggleLogs(job.id)}
                          className="text-[8px] font-black text-primary uppercase flex items-center gap-1.5 hover:underline"
                        >
                          <Terminal className="w-3 h-3" /> 
                          {showLogs[job.id] ? 'Hide' : 'View'} System Log
                          <ChevronDown className={cn("w-2.5 h-2.5 transition-transform", showLogs[job.id] && "rotate-180")} />
                        </button>
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => engine.cancelJob(job.id)}
                      className="h-10 w-10 text-slate-950/40 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {showLogs[job.id] && (
                    <div className="bg-black/90 p-4 font-mono text-[9px] text-emerald-400 space-y-1.5 max-h-40 overflow-y-auto border-t border-white/10">
                      <AnimatePresence initial={false}>
                        {job.logs.map((log, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, rotateX: -20, y: 5 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0 }}
                            className="flex gap-3"
                          >
                            <span className="opacity-40 shrink-0">[{log.timestamp}]</span>
                            <span className={cn(log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-yellow-400' : 'text-emerald-400')}>
                              {log.message}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div className="flex gap-3 opacity-60">
                        <span className="animate-pulse">_</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
