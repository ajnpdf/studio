
"use client";

import { APIContainer } from '@/components/dashboard/api/api-container';
import { Suspense } from 'react';

export default function APIPanelPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Initializing Developer Console...</div>}>
        <APIContainer />
      </Suspense>
    </div>
  );
}
