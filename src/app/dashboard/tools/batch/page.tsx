
"use client";

import { BatchContainer } from '@/components/dashboard/batch/batch-container';
import { Suspense } from 'react';

export default function BatchProcessingPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <BatchContainer />
    </div>
  );
}
