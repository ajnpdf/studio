
"use client";

import { AudioToolsContainer } from '@/components/dashboard/audio-tools/audio-tools-container';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AudioToolsPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <AudioToolsContainer initialFileId={fileId} />
    </div>
  );
}

export default function AudioToolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Initializing Intelligent Audio Engine...</div>}>
      <AudioToolsPageContent />
    </Suspense>
  );
}
