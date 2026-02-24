'use client';

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface ProgressState {
  stage: string;
  detail: string;
  pct: number;
}

export interface LogEntry extends ProgressState {
  ts: number;
}

/**
 * AJN Tool Life-cycle Hook
 * Manages idle, running, done, and error phases for any registry unit.
 */
export function useAJNTool(toolId: string) {
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "error">("idle");
  const [progress, setProgress] = useState<ProgressState>({ stage: "", detail: "", pct: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const onProgress = useCallback((p: ProgressState) => {
    setProgress(p);
    setLogs(prev => [...prev.slice(-49), { ...p, ts: Date.now() }]);
  }, []);

  const run = useCallback(async (inputs: any, options = {}) => {
    abortRef.current = false;
    setPhase("running");
    setLogs([]);
    setError(null);
    setResult(null);

    try {
      const { engine } = await import("@/lib/engine");
      const res = await engine.runTool(toolId, inputs, options, onProgress);
      if (!abortRef.current) { 
        setResult(res); 
        setPhase("done"); 
      }
    } catch (err: any) {
      if (!abortRef.current) { 
        setError(err.message || "Engine execution failed"); 
        setPhase("error"); 
      }
    }
  }, [toolId, onProgress]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setPhase("idle"); 
    setProgress({ stage: "", detail: "", pct: 0 });
    setLogs([]); 
    setResult(null); 
    setError(null);
  }, []);

  return { phase, progress, logs, result, error, run, reset };
}

/**
 * AJN Progress Bar - High Fidelity
 */
export function ProgressBar({ pct, color = "#3B82F6", label }: { pct: number, color?: string, label?: string }) {
  return (
    <div className="w-full font-mono">
      {label && (
        <div className="flex justify-between mb-1.5 text-[10px] font-black uppercase text-slate-950/40 tracking-widest">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full" 
          style={{ backgroundColor: color }} 
        />
      </div>
    </div>
  );
}

/**
 * AJN Live Terminal Log
 */
export function LogStream({ logs, color = "#3B82F6" }: { logs: LogEntry[], color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { 
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; 
  }, [logs]);

  return (
    <div ref={ref} className="h-48 overflow-y-auto p-4 bg-black rounded-2xl border border-white/10 font-mono text-[10px] leading-relaxed scrollbar-hide">
      {logs.map((log, i) => (
        <div key={i} className="mb-1 text-slate-400">
          <span className="text-primary/60 mr-2">[{((log.ts - (logs[0]?.ts || log.ts)) / 1000).toFixed(2)}s]</span>
          <span className={i === logs.length - 1 ? "text-white font-bold" : "text-slate-300"}>
            {log.stage}
          </span>
          {log.detail && <span className="text-slate-500 ml-2">→ {log.detail}</span>}
        </div>
      ))}
      <div className="text-primary animate-pulse inline-block ml-1">▋</div>
    </div>
  );
}