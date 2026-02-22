
"use client";

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Activity, 
  ShieldAlert, 
  Trash2, 
  Settings, 
  BarChart3,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { OverviewTab } from './overview-tab';
import { UsersTab } from './users-tab';
import { RevenueTab } from './revenue-tab';
import { HealthTab } from './health-tab';
import { AbuseTab } from './abuse-tab';
import { CleanupTab } from './cleanup-tab';
import { cn } from '@/lib/utils';
import { NightSky } from '../dashboard/night-sky';

type AdminTab = 'overview' | 'users' | 'revenue' | 'health' | 'abuse' | 'cleanup';

export function AdminContainer() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'revenue', icon: CreditCard, label: 'Revenue & Billing' },
    { id: 'health', icon: Cpu, label: 'System Health' },
    { id: 'abuse', icon: ShieldAlert, label: 'Abuse Detection' },
    { id: 'cleanup', icon: Trash2, label: 'File Cleanup' },
  ];

  return (
    <div className="flex h-full relative">
      <NightSky />
      
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-3xl flex flex-col shrink-0 z-50">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tighter uppercase">Admin Core</h1>
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Internal Ops</p>
            </div>
          </div>
          
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all group",
                  activeTab === item.id 
                    ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 shrink-0",
                  activeTab === item.id ? "text-red-500" : "text-muted-foreground group-hover:text-white"
                )} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-red-500 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500">SYSTEMS OPTIMAL</span>
            </div>
          </div>
          <Link href="/dashboard" className="block">
            <Button variant="ghost" className="w-full justify-start gap-3 h-10 text-muted-foreground hover:text-white hover:bg-white/5">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold">Exit Admin</span>
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black tracking-tight uppercase">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-none text-[8px] font-black tracking-widest uppercase">
              Root Access
            </Badge>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] font-black text-muted-foreground uppercase">1,242 Live Connections</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase">Worker Load: 14%</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto p-10">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'revenue' && <RevenueTab />}
            {activeTab === 'health' && <HealthTab />}
            {activeTab === 'abuse' && <AbuseTab />}
            {activeTab === 'cleanup' && <CleanupTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
