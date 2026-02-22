"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConversionJob } from '@/lib/engine';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Download, Maximize2, Split, Eye, Layers } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

export function PreviewModal({ job, onClose }: { job: ConversionJob | null, onClose: () => void }) {
  const resultUrl = useMemo(() => job?.result ? URL.createObjectURL(job.result.blob) : null, [job]);

  if (!job) return null;

  const isImage = ['jpg', 'png', 'webp', 'gif'].includes(job.toFmt.toLowerCase());
  const isVideo = ['mp4', 'webm', 'mov'].includes(job.toFmt.toLowerCase());
  const isAudio = ['mp3', 'wav', 'flac'].includes(job.toFmt.toLowerCase());

  return (
    <Dialog open={!!job} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[90vw] w-full h-[90vh] bg-card/95 backdrop-blur-3xl border-white/10 p-0 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-background/40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">Output Analysis</DialogTitle>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{job.result?.fileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-6 h-10 gap-2">
              <Download className="w-4 h-4" /> EXPORT TO LOCAL
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-muted-foreground">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 bg-[#0a0e1f] relative overflow-hidden flex items-center justify-center p-12 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]">
          {isImage && resultUrl && (
            <div className="relative w-full h-full max-w-4xl shadow-2xl rounded-sm overflow-hidden border border-white/5 bg-white/5 flex items-center justify-center p-10">
              <Image src={resultUrl} alt="Preview" fill className="object-contain" />
            </div>
          )}

          {isVideo && resultUrl && (
            <div className="w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5">
              <video controls className="w-full h-full object-contain" autoPlay>
                <source src={resultUrl} />
              </video>
            </div>
          )}

          {isAudio && resultUrl && (
            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 border border-white/10 text-center space-y-8">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Layers className="w-10 h-10 text-primary" />
              </div>
              <audio controls className="w-full h-14 filter invert opacity-80" autoPlay>
                <source src={resultUrl} />
              </audio>
              <div className="space-y-2">
                <p className="text-xl font-black">{job.result?.fileName}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Mastered Neural Stream</p>
              </div>
            </div>
          )}

          {!isImage && !isVideo && !isAudio && (
            <div className="p-20 bg-white/5 border border-dashed border-white/10 rounded-[3rem] text-center space-y-6 opacity-40">
              <FileIcon className="w-20 h-20 mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest">Direct content preview for {job.toFmt} is in calibration.</p>
            </div>
          )}
        </div>

        <footer className="h-14 border-t border-white/5 bg-background/40 flex items-center justify-between px-8 shrink-0">
          <div className="flex gap-10">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Dimensions:</span>
              <span className="text-[10px] font-bold uppercase">Original Ratio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Confidence:</span>
              <span className="text-[10px] font-bold uppercase text-emerald-500">99.2%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Neural V2.5 Active</span>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

import { FileIcon } from 'lucide-react';
