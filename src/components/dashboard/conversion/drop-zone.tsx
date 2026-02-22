"use client";

import { useState, useRef } from 'react';
import { Upload, X, FileIcon, ImageIcon, Video, Music, Monitor, Activity, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
          "relative min-h-[360px] rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-700 cursor-pointer group overflow-hidden shadow-2xl",
          isDragging 
            ? "border-primary bg-primary/[0.03] scale-[0.99] shadow-primary/20" 
            : "border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.04]"
        )}
      >
        <input type="file" multiple ref={inputRef} className="hidden" onChange={handleSelect} />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

        <div className={cn(
          "w-24 h-24 bg-white text-black rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all duration-700 relative z-10",
          isDragging ? "scale-125 rotate-12 bg-primary text-white" : "group-hover:scale-110 group-hover:-rotate-3"
        )}>
          <Upload className="w-10 h-10" />
        </div>
        
        <div className="mt-10 space-y-3 text-center relative z-10 px-8">
          <h3 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">Drop assets for mastery</h3>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-700">
          {previews.map((file, i) => (
            <div key={i} className="p-4 bg-[#0d1225]/60 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] flex items-center justify-between group hover:border-primary/40 transition-all shadow-xl">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 border border-primary/10">
                  <FileIcon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black truncate pr-4 text-white/90 uppercase tracking-tighter">{file.name}</p>
                  <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
