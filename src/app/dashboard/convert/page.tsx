
"use client";

import { ConversionEngine } from '@/components/dashboard/conversion/conversion-engine';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConvertPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  return (
    <div className="p-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-black tracking-tighter">Conversion Engine</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium ml-12">
            Professional-grade format transformation with real-time optimization.
          </p>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <ConversionEngine initialFileId={fileId} />
      </div>
    </div>
  );
}

export default function ConvertPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading Conversion Engine...</div>}>
      <ConvertPageContent />
    </Suspense>
  );
}
