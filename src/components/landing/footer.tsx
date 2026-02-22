import Link from 'next/link';
import { Cloud, Github, Twitter, Linkedin, Facebook, Globe, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-brand-gradient rounded-xl shadow-lg">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-gradient">AJN</span>
              </Link>
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/5 w-fit">
                <Activity className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/70">
                  Every File. One Smart Network.
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AJN – All-in-one Junction Network. The ultimate real-time intelligent file operating system in the cloud.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20"><Twitter className="w-4 h-4"/></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20"><Github className="w-4 h-4"/></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20"><Linkedin className="w-4 h-4"/></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20"><Facebook className="w-4 h-4"/></Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/dashboard/convert" className="hover:text-primary transition-colors">Converter</Link></li>
              <li><Link href="/dashboard/pdf-editor" className="hover:text-primary transition-colors">PDF Editor</Link></li>
              <li><Link href="/dashboard/image-editor" className="hover:text-primary transition-colors">Image Optimizer</Link></li>
              <li><Link href="/dashboard/tools/video" className="hover:text-primary transition-colors">Video Tools</Link></li>
              <li><Link href="/dashboard/api" className="hover:text-primary transition-colors">Developer API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Format Wiki</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cloud Security</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Uptime Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">GDPR Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-border/50 gap-6">
          <p className="text-sm text-muted-foreground">© 2026 AJN – All-in-one Junction Network. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
            <Globe className="w-4 h-4" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
