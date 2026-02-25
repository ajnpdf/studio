"use client";

import { PDFEditor } from '@/components/dashboard/pdf-editor/pdf-editor';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';

export default function EditPDFPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden font-body bg-slate-100">
      <NightSky />
      
      <header className="h-16 border-b border-black/5 bg-white/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-[60]">
        <div className="flex items-center gap-6">
          <Link href="/ajn">
            <LogoAnimation className="w-16 h-8" showGlow={false} />
          </Link>
          <div className="h-6 w-px bg-black/5" />
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Advanced Surgical Editor</h1>
        </div>

        <Link href="/ajn">
          <Button variant="ghost" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
          </Button>
        </Link>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <PDFEditor initialFileId={null} />
      </main>
    </div>
  );
}