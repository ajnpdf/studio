
"use client";

import { PDFEditor } from '@/components/dashboard/pdf-editor/pdf-editor';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PDFEditorPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <PDFEditor initialFileId={fileId} />
    </div>
  );
}

export default function PDFEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Initializing Advanced PDF Engine...</div>}>
      <PDFEditorPageContent />
    </Suspense>
  );
}
