
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileIcon, ImageIcon, VideoIcon, MusicIcon, Replace, Info, Maximize2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

interface Props {
  file: any;
  onReplace: () => void;
  onUpload?: (file: File) => void;
}

export function InputPanel({ file, onReplace, onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPreviewIcon = () => {
    if (!file) return null;
    switch (file.type) {
      case 'image': return <ImageIcon className="w-16 h-16 text-blue-500" />;
      case 'video': return <VideoIcon className="w-16 h-16 text-purple-500" />;
      case 'audio': return <MusicIcon className="w-16 h-16 text-pink-500" />;
      default: return <FileIcon className="w-16 h-16 text-indigo-500" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && onUpload) {
      onUpload(f);
    }
  };

  if (!file) {
    return (
      <Card className="bg-card/40 backdrop-blur-xl border-white/5 flex flex-col h-full min-h-0 overflow-hidden">
        <CardContent 
          className="p-0 flex flex-col h-full items-center justify-center text-center cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <div className="p-8 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/10 group-hover:border-primary/40 transition-all">
            <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="mt-6 space-y-2 px-8">
            <h3 className="text-xl font-black uppercase tracking-tighter">Load Source File</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
              Drop any file here to begin high-fidelity neural transformation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 flex flex-col h-full min-h-0 overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Input File</h3>
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[9px]">ORIGINAL: {file.size}</Badge>
        </div>

        <div className="flex-1 bg-white/5 relative flex items-center justify-center overflow-hidden group">
          {file.type === 'image' && !file.file ? (
            <div className="relative w-full h-full p-8">
              <Image 
                src={`https://picsum.photos/seed/${file.id}/800/600`} 
                alt="Preview" 
                fill 
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-8 bg-white/5 rounded-full border border-white/10">
                {getPreviewIcon()}
              </div>
              <p className="text-xs font-bold text-muted-foreground/60">{file.format} PREVIEW</p>
            </div>
          )}
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg bg-black/40 backdrop-blur border-white/10">
              <Maximize2 className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                <FileIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{file.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5">{file.format}</Badge>
                  <span className="text-[10px] text-muted-foreground font-bold">{file.size}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Metadata</p>
                <p className="text-xs font-bold">{file.metadata || 'Detected'}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Session Type</p>
                <p className="text-xs font-bold">{file.file ? 'Local Upload' : 'Sample File'}</p>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10 gap-2 font-bold"
            onClick={onReplace}
          >
            <Replace className="w-4 h-4" /> Replace Input File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
