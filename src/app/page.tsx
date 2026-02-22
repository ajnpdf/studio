import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Button } from '@/components/ui/button';
import { Cloud, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        
        {/* Social Proof / Stats */}
        <section className="py-16 border-y bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-gradient">10M+</p>
                <p className="text-muted-foreground">Files Processed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gradient">200k+</p>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gradient">99.9%</p>
                <p className="text-muted-foreground">Uptime SLA</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gradient">200+</p>
                <p className="text-muted-foreground">Format Types</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-brand-gradient rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cloud className="w-64 h-64" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to work smarter?</h2>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                Join thousands of creative professionals and businesses who trust Cloud Edit Pro for their daily file operations.
              </p>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-2xl">
                  Get Started for Free
                </Button>
              </Link>
              <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-80 text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> No credit card required</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Free 1GB storage</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Cancel anytime</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-gradient rounded-md">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">Cloud Edit Pro</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 Cloud Edit Pro. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
