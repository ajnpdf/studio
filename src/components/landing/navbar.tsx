import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cloud, Menu } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-brand-gradient rounded-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gradient">Cloud Edit Pro</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-brand-gradient hover:opacity-90 transition-opacity">Get Started</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
