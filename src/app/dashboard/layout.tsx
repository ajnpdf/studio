
"use client";

import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardTopBar } from '@/components/dashboard/dashboard-top-bar';
import { NightSky } from '@/components/dashboard/night-sky';
import { useUser, FirebaseClientProvider } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0e1f] text-primary space-y-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Initializing Secure Session...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex text-foreground relative bg-[#0a0e1f]">
      <NightSky />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300 min-h-screen">
        <DashboardTopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <DashboardGuard>{children}</DashboardGuard>
    </FirebaseClientProvider>
  );
}
