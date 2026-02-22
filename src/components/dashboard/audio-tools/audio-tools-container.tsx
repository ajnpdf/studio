
"use client";

import { useState, useEffect } from 'react';
import { WaveformPlayer } from './waveform-player';
import { AudioToolTabs } from './audio-tool-tabs';
import { JobQueue } from '../video-tools/job-queue';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, Share2, Save } from 'lucide-react';
import Link from 'next/link';
import { VideoJob } from '../video-tools/video-tools-container';

export function AudioToolsContainer({ initialFileId }: { initialFileId: string | null }) {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [activeAudio, setActiveAudio] = useState({
    name: 'Interview_Recording.mp3',
    url: 'https://samplelib.com/lib/preview/mp3/sample-12s.mp3',
    format: 'MP3',
    sampleRate: '44100 Hz',
    bitrate: '320 kbps',
    channels: 'Stereo',
    duration: '00:12:45',
    size: '8.2 MB'
  });

  const addJob = (operation: string, settings: any) => {
    const newJob: VideoJob = {
      id: Math.random().toString(36).substr(2, 9),
      filename: activeAudio.name,
      operation,
      status: 'queued',
      progress: 0,
      eta: 'Calculating...'
    };
    setJobs(prev => [newJob, ...prev]);
    simulateJob(newJob.id);
  };

  const simulateJob = async (id: string) => {
    await new Promise(r => setTimeout(r, 1000));
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'processing', eta: '5s' } : j));

    for (let i = 0; i <= 100; i += 20) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, progress: i, eta: `${Math.ceil((100 - i) / 10)}s` } : j));
      await new Promise(r => setTimeout(r, 600));
    }

    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'complete', progress: 100, eta: '0s' } : j));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Toolbar */}
      <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-sm font-black tracking-tighter uppercase">{activeAudio.name}</h1>
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Cloud Audio Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 gap-2 border-white/10 bg-white/5 text-xs font-bold">
            <History className="w-3.5 h-3.5" /> HISTORY
          </Button>
          <Button variant="outline" className="h-9 gap-2 border-white/10 bg-white/5 text-xs font-bold">
            <Share2 className="w-3.5 h-3.5" /> SHARE
          </Button>
          <Button className="h-9 gap-2 bg-primary hover:bg-primary/90 text-xs font-black shadow-lg shadow-primary/20 px-6">
            <Save className="w-3.5 h-3.5" /> SAVE WORKSPACE
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        <div className="p-6 space-y-8 max-w-6xl mx-auto w-full">
          {/* Waveform Section */}
          <WaveformPlayer audio={activeAudio} />

          {/* Tools Section */}
          <AudioToolTabs onProcess={addJob} />

          {/* Queue Section */}
          {jobs.length > 0 && <JobQueue jobs={jobs} />}
        </div>
      </div>
    </div>
  );
}
