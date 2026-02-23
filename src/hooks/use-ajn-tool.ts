
'use client';

import { useState, useCallback, useRef, useEffect } from "react";

export interface ProgressState {
  stage: string;
  detail: string;
  pct: number;
}

export interface LogEntry extends ProgressState {
  ts: number;
}

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
