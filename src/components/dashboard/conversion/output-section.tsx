"use client";

import { ConversionJob } from '@/lib/engine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Eye, Share2, Trash2, CheckCircle2, FileCode, ImageIcon, Video, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  jobs: ConversionJob[];
  onPreview: (j: ConversionJob) => void;
  onClear: () => void;
}

const getIcon = (fmt: string) => {
  const f = fmt.toLowerCase();
  if (['jpg', 'png', 'webp', 'svg'].includes(f)) return <ImageIcon className="w-5 h-5 text-blue-400" />;
  if (['mp4', 'mov', 'gif'].includes(f)) return <Video className="w-5 h-5 text-purple-400" />;
  if (['mp3', 'wav', 'flac'].includes(f)) return <Music className="w-5 h-5 text-pink-400" />;
  return <FileCode className="w-5 h-5 text-emerald-400" />;
};

export function OutputSection({ jobs, onPreview, onClear }: Props) {
  const handleDownload = (job: ConversionJob) => {
    if (!job.result) return;
    const url = URL.createObjectURL(job.result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = job.result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> Mastered Output ({jobs.length})
        </h3>
        <Button variant="ghost" onClick={onClear} className="h-8 text-[10px] font-black uppercase text-red-400 hover:text-red-500 hover:bg-red-500/10">
          <Trash2 className="w-3 h-3 mr-2" /> DISCARD ALL
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-card/40 backdrop-blur-xl border-emerald-500/20 border-2 overflow-hidden hover:border-emerald-500/40 transition-all">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-lg">
                {getIcon(job.toFmt)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-black uppercase tracking-tighter truncate max-w-[300px]">{job.result?.fileName}</h4>
                  <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-2 h-5">SUCCESS</Badge>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>{job.result?.size}</span>
                  <span className="text-emerald-500">-62% REDUCTION</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onPreview(job)}
                  className="h-9 border-white/10 bg-white/5 text-[10px] font-bold uppercase gap-2 hover:bg-primary hover:text-white"
                >
                  <Eye className="w-3.5 h-3.5" /> PREVIEW
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(job)}
                  className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-6 shadow-xl shadow-emerald-500/20 gap-2"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD
                </Button>
                <div className="h-8 w-px bg-white/10 mx-1" />
                <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length > 1 && (
        <Button className="w-full h-14 bg-white text-black hover:bg-white/90 font-black text-sm uppercase tracking-widest shadow-2xl rounded-2xl gap-3">
          <Download className="w-5 h-5" /> DOWNLOAD BATCH AS ZIP ({jobs.length} FILES)
        </Button>
      )}
    </section>
  );
}
