'use client';

import { ConversionJob } from '@/lib/engine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Trash2, CheckCircle2, FileCode, ImageIcon, Video, Music, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Props {
  jobs: ConversionJob[];
  onPreview: (j: ConversionJob) => void;
  onClear: () => void;
}

const getIcon = (fmt: string) => {
  const f = fmt.toLowerCase();
  if (['jpg', 'png', 'webp', 'svg'].includes(f)) return <ImageIcon className="w-5 h-5 text-blue-600" />;
  if (['mp4', 'mov', 'gif', 'avi', 'mkv'].includes(f)) return <Video className="w-5 h-5 text-purple-600" />;
  if (['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(f)) return <Music className="w-5 h-5 text-pink-600" />;
  return <FileCode className="w-5 h-5 text-emerald-600" />;
};

/**
 * AJN Output Section - Professional Mastered Results
 * Enforces Black Text protocol and real-time distribution.
 */
export function OutputSection({ jobs, onPreview, onClear }: Props) {
  const handleDownload = (job: ConversionJob) => {
    if (!job.result?.objectUrl) return;
    const a = document.createElement('a');
    a.href = job.result.objectUrl;
    a.download = job.result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "File Exported",
      description: `${job.result.fileName} saved to local storage.`,
    });
  };

  const handleShare = async (job: ConversionJob) => {
    if (!job.result?.objectUrl) return;
    try {
      const file = new File([job.result.blob], job.result.fileName, { type: job.result.mimeType });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'AJN Mastered File',
          text: `Processed via AJN Junction Network.`
        });
      } else {
        await navigator.clipboard.writeText(job.result.objectUrl);
        toast({
          title: "Link Synced",
          description: "Download link copied to clipboard.",
        });
      }
    } catch (err) {
      console.warn('Share cancelled', err);
    }
  };

  return (
    <section className="space-y-6 animate-in zoom-in-95 duration-500 text-slate-950">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600">
            Mastered Output ({jobs.length})
          </h3>
        </div>
        <button onClick={onClear} className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5" /> Clear Buffer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-white/40 backdrop-blur-3xl border-emerald-500/20 border-2 overflow-hidden hover:border-emerald-500/40 transition-all group relative shadow-xl">
            <CardContent className="p-6 flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 border border-emerald-500/10">
                {getIcon(job.toFmt)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h4 className="text-sm font-black tracking-tight truncate max-w-[280px] text-slate-950">{job.result?.fileName}</h4>
                  <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-2 h-5">READY</Badge>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><FileCode className="w-3 h-3" /> {job.result?.size}</span>
                  <span className="text-emerald-600 font-black">Securely Mastered</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onPreview(job)}
                  className="h-10 border-black/10 bg-white/50 text-[10px] font-bold gap-2 hover:bg-primary hover:text-white px-5 rounded-xl transition-all text-slate-950"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Preview
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(job)}
                  className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-6 shadow-md gap-2 rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" /> Download
                </Button>
                <div className="h-8 w-px bg-black/5 mx-1" />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleShare(job)}
                  className="h-10 w-10 text-slate-950/40 hover:text-slate-950 hover:bg-black/5 rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
