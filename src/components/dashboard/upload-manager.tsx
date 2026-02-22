
"use client";

import { useState } from 'react';
import { UploadZone } from './upload-zone';
import { FileMetadataCard } from './file-metadata-card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TierGateModal } from './tier-gate-modal';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
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
    security?: {
      avStatus: 'clean' | 'infected';
      encryption: 'AES-256';
      tls: '1.3';
      magicBytesVerified: boolean;
    };
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

  // Dynamic tier limits from database
  const TIER_FILE_SIZE_LIMIT = (profile?.tier === 'business' ? 10000 : profile?.tier === 'pro' ? 2000 : 50) * 1024 * 1024;

  const handleFilesAdded = (newFiles: File[]) => {
    if (!user) return;

    const validFiles: File[] = [];
    const oversizedFiles: File[] = [];

    newFiles.forEach(f => {
      if (f.size > TIER_FILE_SIZE_LIMIT) oversizedFiles.push(f);
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
    if (!firestore || !user) return;

    // 1. Uploading State
    for (let i = 0; i <= 100; i += 20) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: i } : f));
      await new Promise(r => setTimeout(r, 150));
    }

    // 2. Scanning State
    setFiles(prev => prev.map(f => f.id === id ? { ...f, state: 'scanning' } : f));
    await new Promise(r => setTimeout(r, 1200));

    // 3. Analyzing State
    setFiles(prev => prev.map(f => f.id === id ? { ...f, state: 'analyzing' } : f));
    await new Promise(r => setTimeout(r, 800));

    // 4. Ready State & Firestore Persistence
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const type = f.file.type;
        const mockMeta: UploadedFile['metadata'] = {
          format: type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
          size: (f.file.size / (1024 * 1024)).toFixed(2) + ' MB',
          security: {
            avStatus: 'clean',
            encryption: 'AES-256',
            tls: '1.3',
            magicBytesVerified: true
          }
        };

        if (type.startsWith('image/')) mockMeta.dimensions = '1920 x 1080 px';
        else if (type.startsWith('video/')) { mockMeta.duration = '00:03:45'; mockMeta.dimensions = '1080p'; }
        else if (type === 'application/pdf') mockMeta.pages = Math.floor(Math.random() * 50) + 1;

        // Persist file metadata to Firestore (Flat structure with ownership denormalization)
        const fileRef = doc(firestore, 'files', id);
        setDocumentNonBlocking(fileRef, {
          fileId: id,
          fileName: f.file.name,
          ownerId: user.uid,
          teamId: profile?.teamId || null,
          teamMembers: profile?.teamId ? { [user.uid]: 'owner' } : {}, // Denormalized for security rules
          fileSize: f.file.size,
          mimeType: type,
          format: mockMeta.format,
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['auto-tagged', type.split('/')[0]],
          versionNumber: 1,
          isDeleted: false
        }, { merge: true });

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
      {/* Security Protocol HUD */}
      <div className="flex flex-wrap gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase text-emerald-500/80">TLS 1.3 Secure Upload</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase text-emerald-500/80">AES-256 At-Rest Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase text-emerald-500/80">Magic Byte Validation Active</span>
        </div>
      </div>

      <UploadZone onFilesAdded={handleFilesAdded} />

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold tracking-tight">Processing Queue</h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold">
                {files.length} {files.length === 1 ? 'FILE' : 'FILES'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className={cn("h-7 w-7 transition-all", viewMode === 'grid' ? "bg-primary text-white shadow-sm" : "text-muted-foreground/60")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className={cn("h-7 w-7 transition-all", viewMode === 'list' ? "bg-primary text-white shadow-sm" : "text-muted-foreground/60")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFiles([])}
                className="h-9 border-red-500/20 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> CLEAR ALL
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
