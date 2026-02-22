
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Network, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-[100] transition-all duration-500",
      scrolled ? "bg-background/60 backdrop-blur-3xl border-b border-white/5 py-4 shadow-2xl" : "bg-transparent py-8"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-white rounded-xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Network className="w-7 h-7 text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase">AJN</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
          <Link href="#features" className="hover:text-white transition-colors">Unit Core</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Economy</Link>
          <Link href="#faq" className="hover:text-white transition-colors">Intelligence</Link>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-white text-black hover:bg-white/90 transition-all font-black text-[10px] uppercase tracking-widest px-8 rounded-xl h-11 shadow-xl">
            Get Access
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-11 w-11 rounded-xl bg-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-3xl border-b border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col gap-8 text-center font-black text-[10px] uppercase tracking-[0.3em] text-white/80">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Unit Core</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Economy</Link>
            <Link href="#faq" onClick={() => setMobileMenuOpen(false)}>Intelligence</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
