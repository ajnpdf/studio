
"use client";

import { useState, useRef } from 'react';
import { Upload, X, FileIcon, ShieldCheck, Zap } from 'lucide-react';
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
    <section className="space-y-6">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative min-h-[320px] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-700 cursor-pointer group overflow-hidden shadow-2xl",
          isDragging 
            ? "border-primary bg-primary/[0.03] scale-[0.99] shadow-primary/20" 
            : "border-black/5 bg-white/40 hover:border-primary/40 hover:bg-white/60"
        )}
      >
        <input type="file" multiple ref={inputRef} className="hidden" onChange={handleSelect} />
        
        {/* VengeanceUI Corner Brackets */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-black/10 group-hover:border-primary/40 transition-colors" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-black/10 group-hover:border-primary/40 transition-colors" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-black/10 group-hover:border-primary/40 transition-colors" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-black/10 group-hover:border-primary/40 transition-colors" />

        {/* Scan Animation Layer */}
        {isDragging && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-x-0 top-0 h-1 bg-primary/20 blur-sm z-20"
          />
        )}

        <div className={cn(
          "w-20 h-20 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-xl transition-all duration-700 relative z-10",
          isDragging ? "scale-125 rotate-12 bg-primary text-white" : "group-hover:scale-110 group-hover:-rotate-3"
        )}>
          <Upload className="w-8 h-8" />
        </div>
        
        <div className="mt-8 space-y-2 text-center relative z-10 px-8">
          <h3 className="text-2xl font-black tracking-tighter text-slate-950 uppercase leading-none">Drop Assets for Mastery</h3>
          <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">Secure Local Buffer</p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {previews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {previews.map((file, i) => (
              <motion.div 
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white/60 backdrop-blur-xl border border-black/5 rounded-[1.5rem] flex items-center justify-between group hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0 border border-primary/10">
                    <FileIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black truncate pr-4 text-slate-950 uppercase tracking-tighter">{file.name}</p>
                    <p className="text-[9px] font-black text-slate-950/40 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                  className="h-10 w-10 flex items-center justify-center text-slate-950/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
