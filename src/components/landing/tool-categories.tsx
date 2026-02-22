import { FileText, ImageIcon, Video, Music, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    icon: FileText,
    title: "PDF Tools",
    count: 14,
    color: "bg-red-500",
    description: "Merge, split, compress, and edit PDFs directly in your browser."
  },
  {
    icon: ImageIcon,
    title: "Image Tools",
    count: 12,
    color: "bg-blue-500",
    description: "Convert formats, optimize size, crop, and apply AI enhancements."
  },
  {
    icon: Video,
    title: "Video Tools",
    count: 8,
    color: "bg-purple-500",
    description: "Trim clips, compress for web, and convert to any device format."
  },
  {
    icon: Music,
    title: "Audio Tools",
    count: 7,
    color: "bg-pink-500",
    description: "Extract audio from video, trim tracks, and normalize volume."
  }
];

export function ToolCategories() {
  return (
    <section className="py-24 bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Universal File Mastery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Click a category to explore specialized tools for every workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="group p-8 bg-card border border-border/50 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{cat.count} Tools</Badge>
              </div>
              <div className={cat.color + " w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform"}>
                <cat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {cat.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                EXPLORE TOOLS <Wand2 className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
