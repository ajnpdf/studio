
"use client";

import { useState } from 'react';
import { FolderTree } from './folder-tree';
import { FileGridContent } from './file-grid-content';
import { FileDetailPanel } from './file-detail-panel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Plus, Filter, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export interface WorkspaceFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'video' | 'audio' | 'doc';
  format: string;
  size: string;
  date: string;
  tags: string[];
  versions: number;
}

const MOCK_FILES: WorkspaceFile[] = [
  { id: '1', name: 'Brand_Logo_v2.png', type: 'image', format: 'PNG', size: '2.4 MB', date: '2 hours ago', tags: ['branding', 'design'], versions: 3 },
  { id: '2', name: 'Project_Proposal_Final.pdf', type: 'pdf', format: 'PDF', size: '12.8 MB', date: '5 hours ago', tags: ['client', 'legal'], versions: 5 },
  { id: '3', name: 'Marketing_Ad_Q1.mp4', type: 'video', format: 'MP4', size: '45.1 MB', date: 'Yesterday', tags: ['marketing', 'video'], versions: 1 },
  { id: '4', name: 'Interview_Recording.mp3', type: 'audio', format: 'MP3', size: '8.2 MB', date: '2 days ago', tags: ['audio', 'interview'], versions: 2 },
  { id: '5', name: 'Financials_2025.xlsx', type: 'doc', format: 'XLSX', size: '1.5 MB', date: '3 days ago', tags: ['finance', 'internal'], versions: 4 },
  { id: '6', name: 'Product_Shoot_Hero.jpg', type: 'image', format: 'JPG', size: '5.6 MB', date: '4 days ago', tags: ['photography', 'raw'], versions: 1 },
  { id: '7', name: 'Terms_and_Conditions.docx', type: 'doc', format: 'DOCX', size: '0.8 MB', date: '5 days ago', tags: ['legal', 'draft'], versions: 2 },
  { id: '8', name: 'Website_Background.webp', type: 'image', format: 'WEBP', size: '1.2 MB', date: '1 week ago', tags: ['web', 'assets'], versions: 1 },
];

export function FileExplorer() {
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);
  const [activeFolder, setActiveFolder] = useState('My Files');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
                className={`h-7 w-7 ${viewMode === 'grid' ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewMode('list')}
                className={`h-7 w-7 ${viewMode === 'list' ? "bg-primary text-white" : "text-muted-foreground"}`}
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

        <FileGridContent 
          files={MOCK_FILES} 
          viewMode={viewMode} 
          selectedFileId={selectedFile?.id || null}
          onSelectFile={setSelectedFile} 
        />
      </div>

      {/* RIGHT — Detail Panel */}
      <FileDetailPanel 
        file={selectedFile} 
        onClose={() => setSelectedFile(null)} 
      />
    </div>
  );
}
