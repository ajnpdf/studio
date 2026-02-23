"use client";

import { useState, useRef } from 'react';
import { Upload, X, FileIcon, ShieldCheck, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  onFiles: (files: File[]) => void;
}

export function DropZone({ onFiles }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setPreviews(prev => [...prev, ...files]);
    onFiles(files);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPreviews(prev => [...prev, ...files]);
    onFiles(files);
  };

  const removeFile = (idx: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <section className="space-y-8">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative min-h-[380px] rounded-[3.5rem] border-4 border-dashed flex flex-col items-center justify-center transition-all duration-700 cursor-pointer group overflow-hidden shadow-2xl",
          isDragging 
            ? "border-primary bg-primary/[0.04] scale-[0.99] shadow-primary/30" 
            : "border-black/5 bg-white/40 hover:border-primary/40 hover:bg-white/60"
        )}
      >
        <input id="dropzone-input" type="file" multiple ref={inputRef} className="hidden" onChange={handleSelect} />
        
        {/* VENGEANCEUI CORNER BRACKETS */}
        {[0, 1, 2, 3].map(i => (
          <motion.div 
            key={i}
            animate={{ opacity: isDragging ? 1 : 0.3 }}
            className="absolute w-12 h-12 border-primary border-solid border-0"
            style={{
              ...(i === 0 && { top: 32, left: 32, borderTopWidth: 4, borderLeftWidth: 4 }),
              ...(i === 1 && { top: 32, right: 32, borderTopWidth: 4, borderRightWidth: 4 }),
              ...(i === 2 && { bottom: 32, left: 32, borderBottomWidth: 4, borderLeftWidth: 4 }),
              ...(i === 3 && { bottom: 32, right: 32, borderBottomWidth: 4, borderRightWidth: 4 }),
            }}
          />
        ))}

        {/* DRAG-DETECT SCAN ANIMATION LAYER */}
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "100%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_20px_rgba(30,58,138,0.8)] z-20"
            />
          )}
        </AnimatePresence>

        <motion.div 
          animate={{ scale: isDragging ? 1.2 : 1, rotate: isDragging ? 6 : 0 }}
          className={cn(
            "w-24 h-24 bg-white text-black rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-700 relative z-10 border-2 border-black/5",
            isDragging ? "bg-primary text-white border-primary/20" : "group-hover:scale-110 group-hover:-rotate-6"
          )}
        >
          <Upload className="w-10 h-10" />
        </motion.div>
        
        <div className="mt-10 space-y-3 text-center relative z-10 px-12">
          <h3 className="text-3xl font-black tracking-tighter text-slate-950 uppercase leading-none">Drop Assets for Mastery</h3>
          <p className="text-[11px] font-black text-slate-950/40 uppercase tracking-[0.4em]">Secure Engineering Buffer</p>
        </div>

        {/* DECORATIVE BACKGROUND HUD */}
        <div className="absolute bottom-10 flex items-center gap-6 opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">WASM Pipeline</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-950" />
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Real-Time Sync</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {previews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {previews.map((file, i) => (
              <motion.div 
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2rem] flex items-center justify-between group hover:border-primary/40 transition-all shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-5 overflow-hidden">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 border border-primary/10 shadow-inner">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden space-y-0.5">
                    <p className="text-xs font-black truncate pr-4 text-slate-950 uppercase tracking-tighter">{file.name}</p>
                    <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                  className="h-10 w-10 flex items-center justify-center text-slate-950/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
