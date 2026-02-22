import Link from 'next/link';
import { Network, Github, Twitter, Linkedin, Facebook, Globe, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  <Network className="w-6 h-6 text-black" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">AJN</span>
              </Link>
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/5 w-fit">
                <Activity className="w-2.5 h-2.5 text-white/40 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                  Every File. One Smart Network.
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AJN – All-in-one Junction Network. The ultimate real-time intelligent file operating system.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white/60 hover:text-white"><Twitter className="w-4 h-4"/></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white/60 hover:text-white"><Github className="w-4 h-4"/></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white/60 hover:text-white"><Linkedin className="w-4 h-4"/></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white/60 hover:text-white"><Facebook className="w-4 h-4"/></Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white/90">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/dashboard/convert" className="hover:text-white transition-colors">Converter</Link></li>
              <li><Link href="/dashboard/pdf-editor" className="hover:text-white transition-colors">PDF Editor</Link></li>
              <li><Link href="/dashboard/image-editor" className="hover:text-white transition-colors">Image Optimizer</Link></li>
              <li><Link href="/dashboard/tools/video" className="hover:text-white transition-colors">Video Tools</Link></li>
              <li><Link href="/dashboard/api" className="hover:text-white transition-colors">Developer API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white/90">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Format Wiki</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Network Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Uptime Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white/90">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">GDPR Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-border/50 gap-6">
          <p className="text-sm text-muted-foreground">© 2026 AJN – All-in-one Junction Network. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
