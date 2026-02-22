import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Creative Director",
    company: "Studio 9",
    text: "AJN is the easiest way to handle client assets. Being able to convert RAW images and PDFs in one place is a game changer for our global team.",
    stars: 5,
    img: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    name: "Marcus Thorne",
    role: "DevOps Engineer",
    company: "CloudFlow",
    text: "We integrated AJN's API into our CMS and it's been rock solid. 99.9% uptime and lightning-fast background processing for thousands of users.",
    stars: 5,
    img: "https://picsum.photos/seed/marcus/100/100"
  },
  {
    name: "Elena Rodriguez",
    role: "Project Manager",
    company: "Innovate Inc.",
    text: "Saved us hundreds of hours converting legacy documentation to web-ready formats via AJN. The AI-powered categorization is incredibly accurate.",
    stars: 5,
    img: "https://picsum.photos/seed/elena/100/100"
  }
];

export function SocialProof() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Global Trust</h3>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Trusted by 2,000,000+ experts</h2>
          
          <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale items-center pt-8">
            {['TechCrunch', 'The Verge', 'Wired', 'Product Hunt', 'Forbes'].map((name, i) => (
              <span key={i} className="text-3xl font-black italic tracking-tighter hover:grayscale-0 hover:opacity-100 transition-all cursor-default">{name}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card p-10 rounded-[3rem] space-y-8 relative group hover:-translate-y-2 transition-all duration-500">
              <Quote className="absolute top-8 right-10 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              <div className="flex gap-1">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground leading-relaxed italic text-lg">&quot;{t.text}&quot;</p>
              
              <div className="flex items-center gap-4 pt-4">
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                  <AvatarImage src={t.img} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-black text-sm uppercase tracking-wider">{t.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}