
"use client";

import { HelpContainer } from '@/components/dashboard/help/help-container';
import { Suspense } from 'react';

export default function HelpPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Accessing Support Knowledge Base...</div>}>
        <HelpContainer />
      </Suspense>
    </div>
  );
}
