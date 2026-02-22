
"use client";

import { useState } from 'react';
import { AuthPanel } from '@/components/auth/auth-panel';
import { BrandPanel } from '@/components/auth/brand-panel';
import { NightSky } from '@/components/dashboard/night-sky';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-background overflow-hidden">
      <NightSky />
      
      {/* LEFT PANEL - Brand Side */}
      <BrandPanel />

      {/* RIGHT PANEL - Auth Form */}
      <main className="w-full md:w-3/5 flex items-center justify-center p-8 md:p-12 z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          <AuthPanel />
        </div>
      </main>
    </div>
  );
}
