
"use client";

import { FileGridContent } from '../files/file-grid-content';
import { WorkspaceFile } from '../files/file-explorer';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const SHARED_FILES: WorkspaceFile[] = [
  { id: 't1', name: 'Brand_Guidelines_2026.pdf', type: 'pdf', format: 'PDF', size: '24.2 MB', date: '10 mins ago', tags: ['team', 'brand'], versions: 12 },
  { id: 't2', name: 'Q1_Marketing_Video.mp4', type: 'video', format: 'MP4', size: '482 MB', date: '1 hour ago', tags: ['marketing', 'raw'], versions: 2 },
  { id: 't3', name: 'Financial_Projections.xlsx', type: 'doc', format: 'XLSX', size: '4.8 MB', date: 'Yesterday', tags: ['finance', 'internal'], versions: 5 },
  { id: 't4', name: 'Product_Catalog_Final.pdf', type: 'pdf', format: 'PDF', size: '18.5 MB', date: '2 days ago', tags: ['sales', 'v1.0'], versions: 1 },
];

export function SharedFilesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black tracking-tight uppercase">Shared Vault</h2>
          <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase">TEAM ACCESS</Badge>
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
        <FileGridContent 
          files={SHARED_FILES} 
          viewMode="grid" 
          selectedFileId={null} 
          onSelectFile={() => {}} 
        />
      </div>
    </div>
  );
}
