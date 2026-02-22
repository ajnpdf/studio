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
  Clock,
  Repeat,
  FileText,
  ImageIcon,
  Video,
  Music,
  Box,
  BrainCircuit,
  HelpCircle,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Hub', href: '/dashboard' },
  { icon: Files, label: 'My Files', href: '/dashboard/files' },
  { icon: Repeat, label: 'Convert', href: '/dashboard/convert' },
];

const toolItems = [
  { icon: FileText, label: 'PDF Tools', href: '/dashboard/tools/pdf' },
  { icon: ImageIcon, label: 'Image Tools', href: '/dashboard/tools/image' },
  { icon: Video, label: 'Video Tools', href: '/dashboard/tools/video' },
  { icon: Music, label: 'Audio Tools', href: '/dashboard/tools/audio' },
  { icon: Box, label: 'Batch Processing', href: '/dashboard/tools/batch' },
  { icon: BrainCircuit, label: 'AI Tools', href: '/dashboard/tools/ai' },
];

const workspaceItems = [
  { icon: Users, label: 'Team', href: '/dashboard/team', disabled: true, badge: 'Business' },
  { icon: Wand2, label: 'API Panel', href: '/dashboard/api' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const supportItems = [
  { icon: HelpCircle, label: 'Help Center', href: '/dashboard/help' },
  { icon: Megaphone, label: 'What\'s New', href: '/dashboard/news' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "border-r bg-sidebar/40 backdrop-blur-xl text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* User Block */}
      <div className="p-6 border-b border-sidebar-border/30">
        <div className={cn("flex items-center gap-3 mb-6 transition-all", collapsed && "justify-center")}>
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">Alex Doe</p>
              <Badge variant="secondary" className="h-4 text-[10px] bg-primary/20 text-primary border-none px-1.5">FREE</Badge>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              <span>Storage</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-1.5 bg-sidebar-border/50" />
            <p className="text-[10px] text-muted-foreground/40 text-right">750MB of 1GB used</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Tools</p>}
          <div className="space-y-1">
            {[...navItems, ...toolItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
                  pathname === item.href 
                    ? "bg-primary/20 text-primary" 
                    : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {pathname === item.href && !collapsed && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full" />}
                <item.icon className={cn(
                  "w-5 h-5 shrink-0",
                  pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-white"
                )} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Workspace</p>}
          <div className="space-y-1">
            {workspaceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  item.disabled ? "opacity-40 cursor-not-allowed" : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-white"
                )}
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badge && <Badge className="text-[9px] h-4 bg-muted text-muted-foreground border-none px-1">{item.badge}</Badge>}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Support</p>}
          <div className="space-y-1">
            {supportItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-white/5 hover:text-white transition-all"
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border/30">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-all mb-4"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <div className="flex items-center gap-3"><ChevronLeft className="w-5 h-5" /> <span>Collapse</span></div>}
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
