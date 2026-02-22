import { ShieldCheck, Trash2, UserCheck, Lock, Globe, CheckCircle2 } from 'lucide-react';

const badges = [
  { icon: Lock, title: "256-bit Encryption", desc: "Files encrypted in transit and at rest" },
  { icon: Trash2, title: "Auto-Delete", desc: "Files deleted after 24 hours automatically" },
  { icon: ShieldCheck, title: "No Data Sharing", desc: "Your files are never shared or sold" },
  { icon: UserCheck, title: "GDPR Compliant", desc: "Meets global privacy standards" },
];

export function TrustSecurity() {
  return (
    <section className="py-24 bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {badges.map((b, i) => (
            <div key={i} className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-card border rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-primary transition-colors shadow-sm">
                <b.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-bold">{b.title}</h4>
              <p className="text-sm text-muted-foreground px-4">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale contrast-125">
          <div className="flex items-center gap-2 font-bold text-xl"><Lock className="w-6 h-6"/> SSL SECURED</div>
          <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6"/> 99.9% UPTIME</div>
          <div className="flex items-center gap-2 font-bold text-xl"><CheckCircle2 className="w-6 h-6"/> ISO COMPLIANT</div>
        </div>
      </div>
    </section>
  );
}
