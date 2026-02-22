
"use client";

import { SettingsContainer } from '@/components/dashboard/settings/settings-container';
import { Suspense } from 'react';

export default function SettingsPage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse uppercase tracking-widest">Initializing User Environment...</div>}>
        <SettingsContainer />
      </Suspense>
    </div>
  );
}
