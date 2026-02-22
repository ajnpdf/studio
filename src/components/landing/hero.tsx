import { Button } from '@/components/ui/button';
import { FileType, Zap, Shield, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-dashboard');

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-gradient opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered File Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            The Smartest Way to <br />
            <span className="text-gradient">Manage Your Files</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Convert, edit, compress, and collaborate on any file type with cloud-native precision and AI-driven workflow suggestions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-12 px-8 bg-brand-gradient text-lg shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform">
              Try For Free
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-2">
              View Demo
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
            <div className="flex items-center gap-2 font-semibold"><Zap className="w-5 h-5"/> FAST</div>
            <div className="flex items-center gap-2 font-semibold"><Shield className="w-5 h-5"/> SECURE</div>
            <div className="flex items-center gap-2 font-semibold"><FileType className="w-5 h-5"/> 200+ FORMATS</div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto group">
          <div className="absolute -inset-1 bg-brand-gradient rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-card rounded-xl shadow-2xl overflow-hidden border">
            {heroImg && (
              <Image 
                src={heroImg.imageUrl}
                alt={heroImg.description}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Floating elements */}
          <div className="absolute -top-10 -left-10 p-4 bg-white rounded-xl shadow-xl border animate-float hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center font-bold text-red-600">PDF</div>
              <div>
                <p className="text-xs font-bold">Proposal.pdf</p>
                <p className="text-[10px] text-muted-foreground">Compressing...</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-10 p-4 bg-white rounded-xl shadow-xl border animate-float-delayed hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center font-bold text-blue-600">JPG</div>
              <div>
                <p className="text-xs font-bold">Header.jpg</p>
                <p className="text-[10px] text-muted-foreground">Optimized by AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
