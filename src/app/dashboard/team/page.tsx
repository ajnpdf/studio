
"use client";

import { TeamContainer } from '@/components/dashboard/team/team-container';
import { Suspense } from 'react';

export default function TeamWorkspacePage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse">Synchronizing Team Workspace...</div>}>
        <TeamContainer />
      </Suspense>
    </div>
  );
}
