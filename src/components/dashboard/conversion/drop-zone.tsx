"use client";

import { useState, useRef } from 'react';
import { Upload, X, FileIcon, ImageIcon, Video, Music, Monitor, Activity } from 'lucide-react';
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
          "relative min-h-[320px] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 cursor-pointer group overflow-hidden",
          isDragging 
            ? "border-primary bg-primary/5 scale-[0.99] shadow-2xl shadow-primary/20" 
            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 shadow-xl"
        )}
      >
        <input type="file" multiple ref={inputRef} className="hidden" onChange={handleSelect} />
        
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />

        <div className={cn(
          "w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 relative z-10",
          isDragging ? "scale-125 rotate-6" : "group-hover:scale-110"
        )}>
          <Upload className="w-10 h-10" />
        </div>
        
        <div className="mt-8 space-y-2 text-center relative z-10">
          <h3 className="text-3xl font-black tracking-tighter text-white">Drop your assets for mastery</h3>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">Supports batch processing up to 10GB total</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white/60 tracking-widest">
            <Monitor className="w-3.5 h-3.5" /> MY DEVICE
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white/60 tracking-widest">
            <Activity className="w-3.5 h-3.5" /> NETWORK PROTOCOL
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-500">
          {previews.map((file, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-primary/40 transition-all">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                  <FileIcon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate pr-4">{file.name}</p>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
