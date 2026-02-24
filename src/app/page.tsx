"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Layers, 
  User, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Cpu, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  MousePointer2
} from 'lucide-react';
import { NightSky } from '@/components/dashboard/night-sky';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * AJN Master Landing Page - Integrated Single-Page Experience
 * Industrial Standard: Arial Typography
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const founderImage = PlaceHolderImages.find(img => img.id === 'founder-portrait');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full text-slate-950 bg-transparent overflow-x-hidden font-sans scroll-smooth">
      <NightSky />
      
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/40 backdrop-blur-xl border-b border-black/5 z-[100] transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">
          <Link href="/" className="flex items-center group">
            <LogoAnimation className="w-20 h-10" showGlow={false} />
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            {['Features', 'Solutions', 'Pricing', 'Story', 'Blog'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40 hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/ajn">
              <Button className="h-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] tracking-[0.2em] rounded-xl uppercase px-6 shadow-xl">
                Enter Junction
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-48 pb-32 text-center max-w-5xl mx-auto px-6 space-y-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <LogoAnimation className="w-56 h-28 md:w-72 md:h-36 mx-auto" />
          </motion.div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-950 leading-[0.85] uppercase">
                All-in-one <br /> Junction <span className="text-primary">Network</span>
              </h1>
              <div className="flex items-center justify-center gap-6">
                <span className="w-12 h-px bg-slate-950/10"></span>
                <p className="text-slate-950/60 text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase">
                  Every File. One Smart Network.
                </p>
                <span className="w-12 h-px bg-slate-950/10"></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link href="/ajn">
                <Button className="h-16 px-12 bg-primary text-white hover:bg-primary/90 font-black text-xs rounded-2xl transition-all gap-4 shadow-2xl hover:scale-105 uppercase tracking-widest">
                  Discover Core <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/junction">
                <Button variant="outline" className="h-16 px-12 border-slate-950/10 bg-white/40 backdrop-blur-xl text-slate-950 font-black text-xs rounded-2xl transition-all gap-4 shadow-xl hover:bg-white/60 uppercase tracking-widest">
                  <Layers className="w-4.5 h-4.5 text-primary" /> Access Junction
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Engineering <span className="text-primary">Units</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950/40">Hardware-accelerated processing in your local sandbox</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Velocity", desc: "Native WebAssembly (WASM) execution for near-instant binary transformations." },
              { icon: ShieldCheck, title: "Sovereignty", desc: "No permanent storage. Your assets are processed in an isolated memory buffer." },
              { icon: Activity, title: "Intelligence", desc: "Integrated neural layers for layout detection and semantic analysis." }
            ].map((f, i) => (
              <Card key={i} className="bg-white/40 backdrop-blur-xl border-black/5 p-10 rounded-[3rem] space-y-6 hover:border-primary/20 transition-all shadow-2xl group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{f.title}</h3>
                <p className="text-xs font-bold text-slate-950/50 leading-relaxed uppercase tracking-[0.1em]">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="solutions" className="py-32 bg-white/20 border-y border-black/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="bg-white/40 backdrop-blur-xl border-black/5 p-12 rounded-[3rem] space-y-8 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center"><User className="w-6 h-6 text-primary" /></div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">For Individuals</h3>
              </div>
              <ul className="space-y-4">
                {['Universal PDF Merging', 'Neural OCR Extraction', 'Visual Split & Extract', 'Smart File Compression'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-950/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full h-14 border-black/10 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">Start Individual Node</Button>
            </Card>

            <Card className="bg-primary text-white border-none p-12 rounded-[3rem] space-y-8 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><Globe className="w-6 h-6 text-white" /></div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">For Business</h3>
              </div>
              <ul className="space-y-4">
                {['High-Concurrency Batching', 'Team Workflow Sync', 'API Management Portal', 'Audit Trail & Compliance'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full h-14 bg-white text-primary hover:bg-white/90 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">Provision Team Space</Button>
            </Card>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-32 px-6 max-w-5xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Transparent <span className="text-primary">Metering</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950/40">Scale your processing requirements as needed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 bg-white/40 border border-black/5 rounded-[3rem] space-y-8 text-left shadow-xl transition-all hover:scale-[1.02]">
              <div className="space-y-2">
                <Badge className="bg-slate-950 text-white font-black text-[8px] uppercase px-3 h-5 tracking-widest">Free Node</Badge>
                <h4 className="text-4xl font-black">$0<span className="text-sm opacity-40">/mo</span></h4>
              </div>
              <p className="text-xs font-bold text-slate-950/40 uppercase leading-relaxed">Perfect for standard document management and individual engineering.</p>
              <div className="h-px bg-black/5" />
              <ul className="space-y-4">
                {['50MB Max File Size', '10 Daily Tasks', 'WASM Local Engine', 'Standard PDF Tools'].map(f => (
                  <li key={f} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3"><ChevronRight className="w-3 h-3 text-primary" /> {f}</li>
                ))}
              </ul>
            </div>

            <div className="p-12 bg-white border-4 border-primary rounded-[3rem] space-y-8 text-left shadow-2xl relative transition-all hover:scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black uppercase px-4 h-8 flex items-center rounded-full tracking-[0.2em] shadow-lg">Most Popular</div>
              <div className="space-y-2">
                <Badge className="bg-primary text-white font-black text-[8px] uppercase px-3 h-5 tracking-widest">Pro Operator</Badge>
                <h4 className="text-4xl font-black text-primary">$12<span className="text-sm opacity-40 text-slate-950">/mo</span></h4>
              </div>
              <p className="text-xs font-bold text-slate-950/40 uppercase leading-relaxed">High-fidelity mastery for creative and business professionals.</p>
              <div className="h-px bg-black/5" />
              <ul className="space-y-4">
                {['2GB Max File Size', 'Unlimited Mastery Tasks', 'Neural Intelligence Access', 'Priority Queue Sync'].map(f => (
                  <li key={f} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 text-primary"><Sparkles className="w-3.5 h-3.5" /> {f}</li>
                ))}
              </ul>
              <Button className="w-full h-14 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl">Upgrade To Pro</Button>
            </div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section id="story" className="py-32 px-6 bg-white/40 border-y border-black/5 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5"
              >
                <div className="relative aspect-square max-w-[450px] mx-auto rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/60 group">
                  <Image 
                    src={founderImage?.imageUrl || "https://picsum.photos/seed/anjan/600/600"} 
                    alt="Anjan Patel" 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    data-ai-hint="founder portrait"
                  />
                  <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-2xl">
                    <p className="text-xl font-black tracking-tighter">Anjan Patel</p>
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">Founder & CEO</p>
                  </div>
                </div>
              </motion.div>

              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Story</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase">Mastering the <br /><span className="text-primary">Browser Buffer</span></h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-950/70 font-medium space-y-6 leading-relaxed text-lg">
                  <p>"AJN was born from a singular vision: To dismantle the barriers between complex file engineering and the everyday professional."</p>
                  <p>"We've built a Junction Network that runs entirely on local WASM and Neural processing layers. Your data should never have to leave your node to achieve professional mastery."</p>
                  <p className="font-bold text-slate-950 italic">— Anjan Patel</p>
                </div>
                <div className="flex gap-10 pt-4">
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-black tracking-tighter">2025</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-950/40">ESTABLISHED</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-black tracking-tighter">100%</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-950/40">LOCAL OPS</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-black tracking-tighter">30+</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-950/40">UNITS ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOG SECTION */}
        <section id="blog" className="py-32 px-6 max-w-7xl mx-auto space-y-16">
          <div className="flex items-end justify-between border-b border-black/5 pb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Neural <span className="text-primary">Insights</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950/40">Official technological stream</p>
            </div>
            <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2">View All Posts <ArrowRight className="w-3 h-3" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Browser-Native Transcoding: The WASM Revolution", cat: "Engineering", date: "FEB 15" },
              { title: "Mastering PDF Security: AES-256 and Redaction", cat: "Security", date: "FEB 12" },
              { title: "Neural OCR: Layout Reconstruction in Real-Time", cat: "Intelligence", date: "FEB 10" }
            ].map((post, i) => (
              <Card key={i} className="bg-white/40 border-black/5 hover:border-primary/20 transition-all rounded-[3rem] overflow-hidden group shadow-xl">
                <CardContent className="p-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase h-5">{post.cat}</Badge>
                    <span className="text-[9px] font-bold text-slate-950/40">{post.date}</span>
                  </div>
                  <h4 className="text-xl font-black leading-tight uppercase group-hover:text-primary transition-colors">{post.title}</h4>
                  <div className="pt-6 border-t border-black/5 flex justify-end">
                    <Button variant="ghost" size="icon" className="group-hover:bg-primary group-hover:text-white rounded-full transition-all"><ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full py-20 border-t border-black/5 flex flex-col items-center gap-10 relative z-10">
        <LogoAnimation className="w-20 h-10 opacity-40" showGlow={false} />
        
        <nav className="flex gap-12 flex-wrap justify-center">
          {['Privacy', 'Terms', 'Support', 'API'].map((link) => (
            <Link key={link} href={`/${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40 hover:text-primary transition-colors">
              {link}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-4">
          <p className="text-[11px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
            AJN Engineering Core • 2025
          </p>
          <div className="flex items-center gap-2.5 px-5 py-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Made by Indian ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
