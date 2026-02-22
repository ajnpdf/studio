"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cloud, Menu, X, ArrowRight } from 'lucide-react';
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
          <div className="p-2.5 bg-brand-gradient rounded-xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Cloud className="w-7 h-7 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-gradient">AJN</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
          <Link href="#features" className="hover:text-primary transition-colors">Tools</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
          <Link href="/dashboard/api" className="hover:text-primary transition-colors">Developer API</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest px-6 hover:bg-white/5">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-white/90 transition-all font-black text-[10px] uppercase tracking-widest px-8 rounded-xl h-11 shadow-xl">
              Open Workspace
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-11 w-11 rounded-xl bg-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-3xl border-b border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col gap-8 text-center font-black text-[10px] uppercase tracking-[0.3em]">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Tools</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/dashboard/api" onClick={() => setMobileMenuOpen(false)}>Developer API</Link>
            <hr className="border-white/10" />
            <Link href="/login" className="text-primary">Sign In to Account</Link>
          </div>
        </div>
      )}
    </nav>
  );
}