import { FileText, ImageIcon, Video, Music, Archive, FileCode, FileType, Database, Terminal, Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formats = [
  { icon: FileText, name: 'PDF', category: 'Documents' },
  { icon: ImageIcon, name: 'PNG', category: 'Images' },
  { icon: Video, name: 'MP4', category: 'Videos' },
  { icon: Music, name: 'MP3', category: 'Audio' },
  { icon: Archive, name: 'ZIP', category: 'Archives' },
  { icon: FileCode, name: 'DOCX', category: 'Documents' },
  { icon: FileType, name: 'SVG', category: 'Images' },
  { icon: Database, name: 'XLSX', category: 'Documents' },
  { icon: Terminal, name: 'JSON', category: 'Documents' },
  { icon: Layers, name: 'RAW', category: 'Images' },
];

export function FormatStrip() {
  const duplicatedFormats = [...formats, ...formats, ...formats];

  return (
    <section className="py-12 border-y border-border/50 bg-card/30 overflow-hidden">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
          {duplicatedFormats.map((f, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="font-bold text-lg text-muted-foreground group-hover:text-foreground transition-colors">{f.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Convert to/from {Math.floor(Math.random() * 8) + 5} {f.category} formats</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </section>
  );
}
