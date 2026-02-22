
"use client";

import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { ServicesCatalog } from '@/components/services/services-catalog';
import { NightSky } from '@/components/dashboard/night-sky';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1f] text-foreground relative overflow-hidden selection:bg-primary/30">
      <NightSky />
      <Navbar />
      <main className="pt-32 relative z-10">
        <ServicesCatalog />
      </main>
      <Footer />
    </div>
  );
}
