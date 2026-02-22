"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cloud, Menu, X } from 'lucide-react';
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
      "fixed top-0 w-full z-[100] transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-xl border-b py-3" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-brand-gradient rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-gradient">AJN</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold tracking-wide">
          <Link href="#features" className="hover:text-primary transition-colors">TOOLS</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">PRICING</Link>
          <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
          <Link href="/dashboard/api" className="hover:text-primary transition-colors">API</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex font-bold">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-brand-gradient hover:opacity-90 transition-opacity font-bold rounded-xl shadow-lg shadow-primary/20">Get Started</Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-card border-b p-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-6 text-center font-bold">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>TOOLS</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>PRICING</Link>
            <Link href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/dashboard/api" onClick={() => setMobileMenuOpen(false)}>API</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
