
"use client";

import { 
  Folder, 
  Upload, 
  Repeat, 
  FileText, 
  Trash2, 
  Users, 
  ChevronRight, 
  Plus,
  MoreVertical,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Props {
  activeFolder: string;
  onSelectFolder: (f: string) => void;
}

const folders = [
  { id: 'my-files', name: 'My Files', icon: Folder, count: 124, size: '2.3 GB' },
  { id: 'uploads', name: 'Uploads', icon: Upload, count: 42, size: '840 MB', parentId: 'my-files' },
  { id: 'converted', name: 'Converted', icon: Repeat, count: 82, size: '1.4 GB', parentId: 'my-files' },
  { id: 'projects', name: 'Projects', icon: FileText, count: 3, size: '42 MB', parentId: 'my-files', hasChildren: true },
  { id: 'shared', name: 'Shared With Me', icon: Users, count: 5, size: '12 MB' },
  { id: 'trash', name: 'Trash', icon: Trash2, count: 14, size: '110 MB' },
];

export function FolderTree({ activeFolder, onSelectFolder }: Props) {
  return (
    <aside className="w-[220px] h-full border-r border-white/5 bg-background/20 backdrop-blur-xl flex flex-col shrink-0">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Library</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelectFolder(folder.name)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all group",
              activeFolder === folder.name 
                ? "bg-primary/20 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <folder.icon className={cn(
              "w-4 h-4 shrink-0",
              activeFolder === folder.name ? "text-primary" : "text-muted-foreground group-hover:text-white"
            )} />
            <span className="flex-1 text-left truncate">{folder.name}</span>
            <span className="text-[9px] opacity-40 group-hover:opacity-100">{folder.count}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
            <span className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> Storage</span>
            <span>75%</span>
          </div>
          <Progress value={75} className="h-1 bg-white/5" />
          <p className="text-[9px] text-muted-foreground/40 font-bold">2.3 GB of 50 GB used</p>
        </div>
        <Button className="w-full h-8 bg-brand-gradient text-[9px] font-black uppercase tracking-widest shadow-lg">
          UPGRADE PLAN
        </Button>
      </div>
    </aside>
  );
}
