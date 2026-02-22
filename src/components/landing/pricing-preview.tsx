import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: "FREE",
    price: "$0",
    period: "forever",
    features: ["Up to 100MB files", "3 conversions per day", "Standard speed", "24h file storage"],
    cta: "Start for Free",
    featured: false
  },
  {
    name: "PRO",
    price: "$12",
    period: "/month",
    features: ["Up to 2GB files", "Unlimited conversions", "Prioritized speed", "7-day file storage", "API access"],
    cta: "Get Started Pro",
    featured: true
  },
  {
    name: "BUSINESS",
    price: "$49",
    period: "/month",
    features: ["Unlimited file size", "Bulk operations", "Team collaboration", "Custom retention", "24/7 Priority Support"],
    cta: "Contact Sales",
    featured: false
  }
];

export function PricingPreview() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Simple, Transparent <span className="text-gradient">Pricing</span></h2>
          <p className="text-muted-foreground">Unlock more power as your workflow grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                "p-10 rounded-[2.5rem] border bg-card flex flex-col relative transition-transform hover:scale-[1.02]",
                plan.featured && "border-primary border-2 shadow-2xl shadow-primary/10"
              )}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-8">
                <p className="text-sm font-bold text-primary mb-2 tracking-widest">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.featured ? "default" : "outline"} 
                className={cn(
                  "w-full h-12 font-bold text-lg rounded-xl",
                  plan.featured ? "bg-brand-gradient hover:opacity-90 shadow-lg" : "border-2"
                )}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
