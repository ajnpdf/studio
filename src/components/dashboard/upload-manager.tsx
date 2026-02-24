"use client";

import { useState } from 'react';
import { UploadZone } from './upload-zone';
import { FileMetadataCard } from './file-metadata-card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Trash2, Activity, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TierGateModal } from './tier-gate-modal';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export type FileState = 'uploading' | 'scanning' | 'analyzing' | 'ready' | 'error';

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  state: FileState;
  metadata?: {
    format: string;
    size: string;
    dimensions?: string;
    pages?: number;
    duration?: string;
    bitrate?: string;
  };
}

export function UploadManager() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gateOpen, setGateOpen] = useState(false);
  const [gateReason, setGateReason] = useState<'size' | 'task' | 'storage' | 'ai'>('size');

  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile } = useDoc(userProfileRef);

  const SESSION_FILE_SIZE_LIMIT = 50 * 1024 * 1024;

  const handleFilesAdded = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const oversizedFiles: File[] = [];

    newFiles.forEach(f => {
      if (f.size > SESSION_FILE_SIZE_LIMIT) oversizedFiles.push(f);
      else validFiles.push(f);
    });

    if (oversizedFiles.length > 0) {
      setGateReason('size');
      setGateOpen(true);
      if (validFiles.length === 0) return;
    }

    const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      state: 'uploading',
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
    uploadedFiles.forEach(fileObj => simulateProcessing(fileObj.id));
  };

  const simulateProcessing = async (id: string) => {
    // 1. Session Loading
    for (let i = 0; i <= 100; i += 25) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: i } : f));
      await new Promise(r => setTimeout(r, 100));
    }

    // 2. System Scanning
    setFiles(prev => prev.map(f => f.id === id ? { ...f, state: 'scanning' } : f));
    await new Promise(r => setTimeout(r, 800));

    // 3. Metadata Mapping
    setFiles(prev => prev.map(f => f.id === id ? { ...f, state: 'analyzing' } : f));
    await new Promise(r => setTimeout(r, 500));

    // 4. Ready State (Local Session only)
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const type = f.file.type;
        const mockMeta: UploadedFile['metadata'] = {
          format: type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
          size: (f.file.size / (1024 * 1024)).toFixed(2) + ' MB'
        };

        if (type.startsWith('image/')) mockMeta.dimensions = 'Detected';
        else if (type === 'application/pdf') mockMeta.pages = 1;

        return { ...f, state: 'ready', metadata: mockMeta };
      }
      return f;
    }));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Session Protocol HUD */}
      <div className="flex flex-wrap gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white" />
          <span className="text-[10px] font-black uppercase text-white/60">Local Fast Processing Active</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-[10px] font-black uppercase text-white/60">In-Session Encryption Enabled</span>
        </div>
      </div>

      <UploadZone onFilesAdded={handleFilesAdded} />

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold tracking-tight">Active Session Queue</h2>
              <Badge variant="outline" className="bg-white/10 text-white border-none font-black">
                {files.length} {files.length === 1 ? 'FILE' : 'FILES'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className={cn("h-7 w-7 transition-all", viewMode === 'grid' ? "bg-white text-black" : "text-muted-foreground/60")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className={cn("h-7 w-7 transition-all", viewMode === 'list' ? "bg-white text-black" : "text-muted-foreground/60")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFiles([])}
                className="h-9 border-white/10 text-white hover:bg-white/10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> DISCARD SESSION
              </Button>
            </div>
          </div>

          <div className={cn(
            "gap-6",
            viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2" : "flex flex-col"
          )}>
            {files.map(file => (
              <FileMetadataCard 
                key={file.id} 
                file={file} 
                onRemove={() => removeFile(file.id)}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      )}

      <TierGateModal 
        open={gateOpen} 
        onOpenChange={setGateOpen} 
        reason={gateReason} 
      />
    </div>
  );
}
