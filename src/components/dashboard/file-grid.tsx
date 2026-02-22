"use client";

import { FileIcon, ImageIcon, VideoIcon, MusicIcon, MoreVertical, Share2, Download, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const files = [
  { id: 1, name: 'Brand_Logo_v2.png', type: 'image', size: '2.4 MB', date: '2 hours ago' },
  { id: 2, name: 'Project_Proposal.pdf', type: 'pdf', size: '12.8 MB', date: '5 hours ago' },
  { id: 3, name: 'Marketing_Ad.mp4', type: 'video', size: '45.1 MB', date: 'Yesterday' },
  { id: 4, name: 'Interview_Recording.mp3', type: 'audio', size: '8.2 MB', date: '2 days ago' },
  { id: 5, name: 'Financials_2025.xlsx', type: 'doc', size: '1.5 MB', date: '3 days ago' },
  { id: 6, name: 'Product_Shoot_01.jpg', type: 'image', size: '5.6 MB', date: '4 days ago' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
    case 'video': return <VideoIcon className="w-8 h-8 text-purple-500" />;
    case 'audio': return <MusicIcon className="w-8 h-8 text-pink-500" />;
    default: return <FileIcon className="w-8 h-8 text-indigo-500" />;
  }
};

export function FileGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {files.map((file) => (
        <Card key={file.id} className="group relative hover:shadow-xl transition-all hover:-translate-y-1 border-primary/5">
          <CardContent className="p-0">
            <div className="h-32 bg-muted/30 flex items-center justify-center relative rounded-t-lg overflow-hidden">
              <div className="group-hover:scale-110 transition-transform duration-300">
                {getIcon(file.type)}
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem className="gap-2"><Download className="w-4 h-4" /> Download</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><Share2 className="w-4 h-4" /> Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold truncate mb-1">{file.name}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
