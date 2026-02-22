"use client";

import { AIToolsContainer } from '@/components/dashboard/ai-tools/ai-tools-container';
import { Suspense } from 'react';

export default function AIToolsPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Initializing Intelligent Hub...</div>}>
        <AIToolsContainer />
      </Suspense>
    </div>
  );
}
