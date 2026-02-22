
"use client";

import { UploadManager } from '@/components/dashboard/upload-manager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-black tracking-tighter">Universal Upload</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium ml-12">
            Securely upload, scan, and analyze your assets for intelligent processing.
          </p>
        </div>
      </header>

      <UploadManager />
    </div>
  );
}
