
"use client";

import { ImageEditor } from '@/components/dashboard/image-editor/image-editor';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ImageEditorPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <ImageEditor initialFileId={fileId} />
    </div>
  );
}

export default function ImageEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Initializing Intelligent Image Engine...</div>}>
      <ImageEditorPageContent />
    </Suspense>
  );
}
