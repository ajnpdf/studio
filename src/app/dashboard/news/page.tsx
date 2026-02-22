
"use client";

import { NewsContainer } from '@/components/dashboard/news/news-container';
import { Suspense } from 'react';

export default function NewsPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Syncing Network Updates...</div>}>
        <NewsContainer />
      </Suspense>
    </div>
  );
}
