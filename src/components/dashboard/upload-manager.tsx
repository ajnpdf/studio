
"use client";

import { useState } from 'react';
import { UploadZone } from './upload-zone';
import { FileMetadataCard } from './file-metadata-card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

  const handleFilesAdded = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      state: 'uploading',
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);

    // Simulate the processing pipeline for each file
    uploadedFiles.forEach(fileObj => simulateProcessing(fileObj.id));
  };

  const simulateProcessing = async (id: string) => {
    // 1. Uploading State
    for (let i = 0; i <= 100; i += 10) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: i } : f));
      await new Promise(r => setTimeout(r, 200));
    }

    // 2. Scanning State
    setFiles(prev => prev.map(f => f.id === id ? { ...f, state: 'scanning' } : f));
    await new Promise(r => setTimeout(r, 1500));

    // 3. Analyzing State
    setFiles(prev => prev.map(f => f.id === id ? { ...f, state: 'analyzing' } : f));
    await new Promise(r => setTimeout(r, 1000));

    // 4. Ready State with mock metadata extraction
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const type = f.file.type;
        const mockMeta: UploadedFile['metadata'] = {
          format: type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
          size: (f.file.size / (1024 * 1024)).toFixed(2) + ' MB',
        };

        if (type.startsWith('image/')) {
          mockMeta.dimensions = '1920 x 1080 px';
        } else if (type.startsWith('video/')) {
          mockMeta.duration = '00:03:45';
          mockMeta.dimensions = '1080p';
        } else if (type === 'application/pdf') {
          mockMeta.pages = Math.floor(Math.random() * 50) + 1;
        }

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
    </div>
  );
}
