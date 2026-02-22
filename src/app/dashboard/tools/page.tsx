
"use client";

import { ToolsDirectory } from '@/components/dashboard/tools/tools-directory';
import { Suspense } from 'react';

export default function AllToolsPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse uppercase tracking-[0.2em]">Synchronizing Service Directory...</div>}>
        <ToolsDirectory />
      </Suspense>
    </div>
  );
}
