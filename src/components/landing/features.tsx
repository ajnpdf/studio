import { ArrowRightLeft, Scissors, Shrink, Share2, Search, BrainCircuit } from 'lucide-react';

const features = [
  {
    icon: ArrowRightLeft,
    title: "Universal Converter",
    desc: "Convert images, docs, videos, and audio between 200+ formats instantly.",
    color: "bg-blue-500"
  },
  {
    icon: Scissors,
    title: "Pro Editor",
    desc: "Crop, resize, apply filters, and trim files without leaving your browser.",
    color: "bg-purple-500"
  },
  {
    icon: Shrink,
    title: "Smart Compression",
    desc: "Reduce file sizes up to 90% while maintaining pixel-perfect quality.",
    color: "bg-pink-500"
  },
  {
    icon: Share2,
    title: "Real-time Sync",
    desc: "Collaborate with team members on files with live updates and history.",
    color: "bg-indigo-500"
  },
  {
    icon: BrainCircuit,
    title: "AI Suggestions",
    desc: "Our engine suggests the best tools based on your file type and intent.",
    color: "bg-cyan-500"
  },
  {
    icon: Search,
    title: "Instant Search",
    desc: "Find any file in seconds with deep-content indexing and tagging.",
    color: "bg-emerald-500"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for <span className="text-gradient">File Mastery</span></h2>
          <p className="text-muted-foreground">A unified workspace that eliminates the need for dozens of separate single-purpose tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 bg-card rounded-2xl border hover:shadow-xl transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
