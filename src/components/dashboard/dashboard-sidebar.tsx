"use client";

import { 
  Cloud, 
  Files, 
  Wand2, 
  Users, 
  Settings, 
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Hub', href: '/dashboard' },
  { icon: Files, label: 'My Files', href: '/dashboard/files' },
  { icon: Wand2, label: 'Smart Tools', href: '/dashboard/tools' },
  { icon: Clock, label: 'Activity', href: '/dashboard/activity' },
  { icon: Users, label: 'Collaborate', href: '/dashboard/collab' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-sidebar-primary rounded-lg shadow-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Cloud Edit</span>
        </Link>
      </div>

      <div className="px-4 mb-8">
        <Button className="w-full bg-accent-gradient hover:opacity-90 border-none shadow-lg text-white gap-2 h-11">
          <PlusCircle className="w-4 h-4" />
          Upload New File
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
              pathname === item.href 
                ? "bg-sidebar-accent text-white" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              pathname === item.href ? "text-white" : "text-sidebar-foreground/50 group-hover:text-white"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border space-y-4">
        <div className="bg-sidebar-accent/50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/60">Storage used</span>
            <span className="text-xs font-bold">75%</span>
          </div>
          <div className="h-1.5 w-full bg-sidebar-border rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-brand-gradient" />
          </div>
          <p className="text-[10px] mt-2 text-white/40">750MB of 1GB used</p>
        </div>
        
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-white">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 w-full transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
