import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Creative Director",
    company: "Studio 9",
    text: "AJN is the easiest way to handle client assets. Being able to convert RAW images and PDFs in one place is a game changer.",
    stars: 5,
    img: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    name: "Marcus Thorne",
    role: "DevOps Engineer",
    company: "CloudFlow",
    text: "We integrated AJN's API into our CMS and it's been rock solid. 99.9% uptime isn't just a marketing claim.",
    stars: 5,
    img: "https://picsum.photos/seed/marcus/100/100"
  },
  {
    name: "Elena Rodriguez",
    role: "Project Manager",
    company: "Innovate Inc.",
    text: "Saved us hours of work converting legacy documentation to web-ready formats via AJN. The compression is pixel perfect.",
    stars: 5,
    img: "https://picsum.photos/seed/elena/100/100"
  }
];

export function SocialProof() {
  return (
    <section className="py-24 bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-8">Trusted by 2,000,000+ users worldwide</h3>
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale items-center">
            {['TechCrunch', 'The Verge', 'Wired', 'Product Hunt', 'Lifehacker'].map((name, i) => (
              <span key={i} className="text-2xl font-black italic tracking-tighter">{name}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card p-8 rounded-[2rem] border shadow-sm space-y-6">
              <div className="flex gap-1">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed italic">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarImage src={t.img} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
