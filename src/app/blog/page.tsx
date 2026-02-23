"use client";

import { motion } from 'framer-motion';
import { NightSky } from '@/components/dashboard/night-sky';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const posts = [
  {
    id: 1,
    title: "Introducing AJN: The Future of Browser-Native Engineering",
    excerpt: "Why we built a Junction Network that runs entirely on WASM and Neural processing layers.",
    date: "Feb 15, 2025",
    author: "Anjan Patel",
    cat: "Engineering"
  },
  {
    id: 2,
    title: "Mastering PDF Security: AES-256 and Redaction",
    excerpt: "A deep dive into how our cryptographic layers protect your sensitive data in real-time.",
    date: "Feb 12, 2025",
    author: "AJN Core Team",
    cat: "Security"
  },
  {
    id: 3,
    title: "The Rise of Neural OCR in Digital Archiving",
    excerpt: "How AI is changing the landscape of document recognition and layout reconstruction.",
    date: "Feb 10, 2025",
    author: "Anjan Patel",
    cat: "Intelligence"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen text-slate-950 font-body relative">
      <NightSky />
      
      <header className="h-20 flex items-center justify-between px-8 max-w-7xl mx-auto w-full relative z-50">
        <Link href="/">
          <LogoAnimation className="w-24 h-12" showGlow={false} />
        </Link>
        <Link href="/">
          <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2">
            <ArrowLeft className="w-4 h-4" /> Exit Blog
          </Button>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-16 relative z-10">
        <section className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
            Engineering <span className="text-primary">Insights</span>
          </h1>
          <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.4em]">
            Official AJN Product & Technology Updates
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-white/40 backdrop-blur-xl border-black/5 hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-xl group">
                <CardContent className="p-8 flex flex-col h-full space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase px-2 h-5 tracking-widest">
                      {post.cat}
                    </Badge>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-950/40">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h2 className="text-xl font-black uppercase leading-tight tracking-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[11px] font-medium text-slate-950/60 leading-relaxed uppercase tracking-wide">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                      <User className="w-3.5 h-3.5" /> {post.author}
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:bg-primary group-hover:text-white rounded-full transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="py-20 text-center space-y-4">
          <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">
            MADE BY INDIAN ❤️
          </p>
        </section>
      </main>
    </div>
  );
}
