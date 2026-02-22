
"use client";

import { useState } from 'react';
import { FolderTree } from './folder-tree';
import { FileGridContent } from './file-grid-content';
import { FileDetailPanel } from './file-detail-panel';
import { Button } from '@/components/ui/button';
import { Search, Plus, LayoutGrid, List, ArrowUpDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export interface WorkspaceFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'video' | 'audio' | 'doc';
  format: string;
  size: string;
  date: string;
  tags: string[];
  versions: number;
  uploadDate?: string;
  fileType?: string;
}

export function FileExplorer() {
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);
  const [activeFolder, setActiveFolder] = useState('My Files');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { user } = useUser();
  const firestore = useFirestore();

  const filesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Query files within the user's isolated workspace
    // Assuming workspaceId is the same as userId for personal space
    return query(
      collection(firestore, 'workspaces', user.uid, 'files'),
      orderBy('uploadDate', 'desc')
    );
  }, [firestore, user]);

  const { data: dbFiles, isLoading } = useCollection<WorkspaceFile>(filesQuery);

  // Map Firestore data to the component's internal interface if needed
  const files: WorkspaceFile[] = (dbFiles || []).map(f => ({
    ...f,
    type: (f.fileType?.split('/')[0] as any) || 'doc',
    format: f.format || f.name.split('.').pop()?.toUpperCase() || 'UNK',
    date: f.uploadDate ? new Date(f.uploadDate).toLocaleDateString() : 'N/A',
    tags: f.tags || [],
    versions: f.versions || 1,
  }));

  return (
    <div className="flex h-full overflow-hidden">
      {/* LEFT — Folder Tree */}
      <FolderTree 
        activeFolder={activeFolder} 
        onSelectFolder={setActiveFolder} 
      />

      {/* CENTER — Main Grid */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
        <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-sm font-black tracking-tighter uppercase">{activeFolder}</h1>
            <div className="h-4 w-px bg-white/10" />
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                placeholder="Search filenames, tags, content..." 
                className="h-9 pl-9 bg-white/5 border-white/10 text-xs font-medium focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewMode('grid')}
                className={cn("h-7 w-7", viewMode === 'grid' ? "bg-primary text-white" : "text-muted-foreground")}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewMode('list')}
                className={cn("h-7 w-7", viewMode === 'list' ? "bg-primary text-white" : "text-muted-foreground")}
              >
                <List className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Button variant="outline" className="h-9 gap-2 border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpDown className="w-3.5 h-3.5" /> SORT
            </Button>
            <Link href="/dashboard/upload">
              <Button className="h-9 gap-2 bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                <Plus className="w-3.5 h-3.5" /> UPLOAD
              </Button>
            </Link>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing Vault...</p>
          </div>
        ) : (
          <FileGridContent 
            files={files} 
            viewMode={viewMode} 
            selectedFileId={selectedFile?.id || null}
            onSelectFile={setSelectedFile} 
          />
        )}
      </div>

      {/* RIGHT — Detail Panel */}
      <FileDetailPanel 
        file={selectedFile} 
        onClose={() => setSelectedFile(null)} 
      />
    </div>
  );
}

import { cn } from '@/lib/utils';
