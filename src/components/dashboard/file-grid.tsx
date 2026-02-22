
"use client";

import { FileIcon, ImageIcon, VideoIcon, MusicIcon, MoreVertical, Share2, Download, Trash2, Eye, Repeat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FileGridProps {
  view: 'grid' | 'list';
}

const files = [
  { id: 1, name: 'Brand_Logo_v2.png', type: 'image', size: '2.4 MB', date: '2 hours ago', format: 'PNG' },
  { id: 2, name: 'Project_Proposal_Final.pdf', type: 'pdf', size: '12.8 MB', date: '5 hours ago', format: 'PDF' },
  { id: 3, name: 'Marketing_Ad_Q1.mp4', type: 'video', size: '45.1 MB', date: 'Yesterday', format: 'MP4' },
  { id: 4, name: 'Interview_Recording.mp3', type: 'audio', size: '8.2 MB', date: '2 days ago', format: 'MP3' },
  { id: 5, name: 'Financials_2025.xlsx', type: 'doc', size: '1.5 MB', date: '3 days ago', format: 'XLSX' },
  { id: 6, name: 'Product_Shoot_Hero.jpg', type: 'image', size: '5.6 MB', date: '4 days ago', format: 'JPG' },
  { id: 7, name: 'Terms_and_Conditions.docx', type: 'doc', size: '0.8 MB', date: '5 days ago', format: 'DOCX' },
  { id: 8, name: 'Website_Background.webp', type: 'image', size: '1.2 MB', date: '1 week ago', format: 'WEBP' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
    case 'video': return <VideoIcon className="w-8 h-8 text-purple-500" />;
    case 'audio': return <MusicIcon className="w-8 h-8 text-pink-500" />;
    default: return <FileIcon className="w-8 h-8 text-indigo-500" />;
  }
};

export function FileGrid({ view }: FileGridProps) {
  if (view === 'list') {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground/60">Name</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground/60">Size</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground/60">Modified</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                    {getIcon(file.type)}
                  </div>
                  <div>
                    <p className="font-bold">{file.name}</p>
                    <Badge variant="outline" className="text-[8px] h-3 px-1 border-white/10 bg-transparent text-muted-foreground">{file.format}</Badge>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-muted-foreground">{file.size}</td>
                <td className="px-6 py-4 font-medium text-muted-foreground">{file.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary"><Eye className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary"><Download className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {files.map((file) => (
        <Card key={file.id} className="group relative bg-card/40 backdrop-blur-md hover:shadow-2xl transition-all hover:-translate-y-1 border-white/5 hover:border-primary/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-32 bg-white/5 flex items-center justify-center relative rounded-t-lg overflow-hidden group">
              <div className="group-hover:scale-110 transition-transform duration-500">
                {getIcon(file.type)}
              </div>
              
              {/* Overlay Quick Actions */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-primary text-white rounded-full">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-primary text-white rounded-full">
                  <Repeat className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 bg-white/10 hover:bg-primary text-white rounded-full">
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-black/60 backdrop-blur border border-white/10 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-card/90 backdrop-blur-xl border-white/10">
                    <DropdownMenuItem className="gap-2 text-xs font-bold"><Share2 className="w-3.5 h-3.5" /> SHARE</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs font-bold"><Download className="w-3.5 h-3.5" /> DOWNLOAD</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem className="gap-2 text-xs font-bold text-destructive"><Trash2 className="w-3.5 h-3.5" /> DELETE</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary/20 text-primary border-none text-[8px] font-bold tracking-widest">{file.format}</Badge>
              </div>
            </div>
            <div className="p-4 bg-white/5">
              <p className="font-bold truncate text-sm mb-1">{file.name}</p>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
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
