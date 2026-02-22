
"use client";

import { VideoToolsContainer } from '@/components/dashboard/video-tools/video-tools-container';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VideoToolsPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <VideoToolsContainer initialFileId={fileId} />
    </div>
  );
}

export default function VideoToolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Initializing Video Engine...</div>}>
      <VideoToolsPageContent />
    </Suspense>
  );
}
