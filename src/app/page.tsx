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
  Layout,
  Scissors,
  Search,
  Shrink,
  MousePointer2,
  FileText
} from 'lucide-react';
import { NightSky } from '@/components/dashboard/night-sky';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * All-in-one Junction Network - Unified Landing Hub
 * Simple Professional Industrial Design
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const founderImage = PlaceHolderImages.find(img => img.id === 'founder-portrait');

  const popularTools = [
    { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple documents.', icon: Layout, color: 'text-blue-500' },
    { id: 'split-pdf', name: 'Split PDF', desc: 'Divide files by page range.', icon: Scissors, color: 'text-indigo-500' },
    { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce document size.', icon: Shrink, color: 'text-emerald-500' },
    { id: 'ocr-pdf', name: 'Text Recognition', desc: 'Recognize text in scans.', icon: Search, color: 'text-orange-500' },
    { id: 'edit-pdf', name: 'Edit PDF', desc: 'Modify existing content.', icon: MousePointer2, color: 'text-pink-500' },
    { id: 'sign-pdf', name: 'Sign PDF', desc: 'Add digital signatures.', icon: FileText, color: 'text-slate-900' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full text-slate-950 bg-transparent overflow-x-hidden font-sans scroll-smooth">
      <NightSky />
      
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/40 backdrop-blur-xl border-b border-black/5 z-[100]">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">
          <Link href="/" className="flex items-center group">
            <LogoAnimation className="w-20 h-10" showGlow={false} />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10">
            {['Tools', 'Features', 'Solutions', 'Story', 'News'].map((item) => (
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
                Open Tools
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-48 pb-20 text-center max-w-5xl mx-auto px-6 space-y-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 leading-[0.9] uppercase">
                All-in-one <br /> Junction Network
              </h1>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center gap-6">
                  <span className="w-12 h-px bg-slate-950/10"></span>
                  <p className="text-slate-950/60 text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase">
                    Every File. One Simple Network.
                  </p>
                  <span className="w-12 h-px bg-slate-950/10"></span>
                </div>
                <div className="px-6 py-2 bg-primary/5 border border-primary/10 rounded-full shadow-sm max-w-2xl mx-auto">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-relaxed">
                    Only this site provides professional PDF tools and real-time conversion services entirely free
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/ajn">
                <Button className="h-16 px-12 bg-primary text-white font-black text-xs rounded-2xl transition-all gap-4 shadow-2xl hover:scale-105 uppercase tracking-widest">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* TOOLS GRID SECTION */}
        <section id="tools" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Popular <span className="text-primary">PDF Tools</span></h2>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-950/40">Immediate access to professional processing</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {popularTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}>
                <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden border backdrop-blur-xl shadow-md group rounded-[2rem]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center border border-black/5 group-hover:scale-110 transition-all">
                      <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-tight text-slate-950">{tool.name}</h3>
                      <p className="text-[9px] font-bold text-slate-950/40 uppercase tracking-widest">{tool.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center pt-8">
            <Link href="/junction">
              <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-3 text-primary hover:bg-primary/5 rounded-xl px-8 h-12">
                <Layers className="w-4 h-4" /> View All Tools
              </Button>
            </Link>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Core <span className="text-primary">Features</span></h2>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-950/40">Reliable Performance Standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Processing", desc: "Optimized local execution for instant document transformations." },
              { icon: ShieldCheck, title: "Secure Privacy", desc: "Your files are processed entirely in your local buffer." },
              { icon: Activity, title: "Advanced Tools", desc: "Integrated tools for accurate text extraction and document editing." }
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
        <section id="solutions" className="py-24 bg-white/20 border-y border-black/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Workflow <span className="text-primary">Solutions</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950/40">Professional tools for students, individuals and teams</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* FOR INDIVIDUALS */}
              <Card className="bg-white/40 backdrop-blur-xl border-black/5 p-12 rounded-[3.5rem] space-y-10 shadow-2xl hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center"><User className="w-7 h-7 text-primary" /></div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">For Individuals</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    'Universal PDF Merging', 
                    'Text Recognition (OCR)', 
                    'Visual Split & Extract', 
                    'File Compression'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-950/60">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/ajn" className="block pt-4">
                  <Button className="w-full h-16 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl">Start for Individuals</Button>
                </Link>
              </Card>

              {/* FOR BUSINESS */}
              <Card className="bg-primary text-white border-none p-12 rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <Globe className="w-64 h-64" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center"><Globe className="w-7 h-7 text-white" /></div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">For Business</h3>
                </div>
                <ul className="space-y-5 relative z-10">
                  {[
                    'High-Speed Batching', 
                    'Team Sync', 
                    'API Management Portal', 
                    'Audit Logs & Compliance'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/60">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/ajn" className="block relative z-10 pt-4">
                  <Button className="w-full h-16 bg-white text-primary hover:bg-white/90 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl">Start for Business</Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section id="story" className="py-24 px-6 bg-white/40 border-y border-black/5 overflow-hidden">
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
                    alt="Founder" 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    data-ai-hint="portrait"
                  />
                  <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-2xl">
                    <p className="text-xl font-black tracking-tighter uppercase text-slate-950">Anjan Patel</p>
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">Founder of AJN</p>
                  </div>
                </div>
              </motion.div>

              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Mission</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase">Simple Document <br /><span className="text-primary">Processing</span></h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-950/70 font-medium space-y-6 leading-relaxed text-lg uppercase tracking-widest">
                  <p>"AJN was created to make professional document tools accessible to everyone."</p>
                  <p>"We've built a platform that runs entirely in your browser. Your data stays with you while you get the results you need."</p>
                  <p className="font-bold text-slate-950 italic">— Anjan Patel</p>
                </div>
                <div className="flex gap-10 pt-4">
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-black tracking-tighter">2025</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-950/40">ESTABLISHED</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-black tracking-tighter">100%</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-950/40">PRIVACY</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-black tracking-tighter">30+</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-950/40">TOOLS ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWS SECTION */}
        <section id="news" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
          <div className="flex items-end justify-between border-b border-black/5 pb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Latest <span className="text-primary">News</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950/40">Platform Updates</p>
            </div>
            <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2">View All Updates <ArrowRight className="w-3 h-3" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Browser-Based Document Processing", cat: "Updates", date: "FEB 15" },
              { title: "Protecting Your Files with Encryption", cat: "Security", date: "FEB 12" },
              { title: "Advanced Text Recognition Updates", cat: "Features", date: "FEB 10" }
            ].map((post, i) => (
              <Card key={i} className="bg-white/40 border-black/5 hover:border-primary/20 transition-all rounded-[3.5rem] overflow-hidden group shadow-xl">
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
            <Link key={link} href={`/${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-slate-950/40 hover:text-primary transition-colors">
              {link}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-4">
          <p className="text-[11px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
            AJN Core • 2025
          </p>
          <div className="flex items-center gap-2.5 px-5 py-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Made in India ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}