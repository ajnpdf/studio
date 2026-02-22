
"use client";

import { AdminContainer } from '@/components/admin/admin-container';
import { Suspense } from 'react';

export default function AdminPanelPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#0a0e1f] animate-in fade-in duration-700">
      <Suspense fallback={<div className="p-8 text-center font-bold text-primary animate-pulse uppercase tracking-widest">Accessing Secure Admin Core...</div>}>
        <AdminContainer />
      </Suspense>
    </div>
  );
}
