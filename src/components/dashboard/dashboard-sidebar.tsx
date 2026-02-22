
"use client";

import { 
  Cloud, 
  Files, 
  Wand2, 
  Users, 
  Settings, 
  LayoutDashboard,
  LogOut,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { icon: Files, label: 'My Files', href: '/dashboard/files', description: 'Manage your assets' },
  { icon: Repeat, label: 'Convert', href: '/dashboard/convert', description: 'Universal format changer' },
];

const toolItems = [
  { icon: FileText, label: 'PDF Tools', href: '/dashboard/pdf-editor', description: 'Edit and manage PDFs' },
  { icon: ImageIcon, label: 'Image Tools', href: '/dashboard/image-editor', description: 'Optimize and transform' },
  { icon: Video, label: 'Video Tools', href: '/dashboard/tools/video', description: 'Cut and compress clips' },
  { icon: Music, label: 'Audio Tools', href: '/dashboard/tools/audio', description: 'Track manipulation' },
  { icon: Box, label: 'Batch Processing', href: '/dashboard/tools/batch', description: 'Multiple file operations' },
  { icon: BrainCircuit, label: 'AI Tools', href: '/dashboard/tools/ai', description: 'Intelligent file workflows' },
];

const workspaceItems = [
  { icon: Users, label: 'Team', href: '/dashboard/team', disabled: false, badge: 'Business', description: 'Collaborative workspaces' },
  { icon: Wand2, label: 'API Panel', href: '/dashboard/api', description: 'Developer keys and logs' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', description: 'Account and preferences' },
];

const supportItems = [
  { icon: HelpCircle, label: 'Help Center', href: '/dashboard/help', description: 'Guides and FAQs' },
  { icon: Megaphone, label: "What's New", href: '/dashboard/news', description: 'Latest product updates' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const NavLink = ({ item }: { item: any }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.disabled ? '#' : item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
              pathname === item.href 
                ? "bg-primary/20 text-primary" 
                : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-white",
              item.disabled && "opacity-40 cursor-not-allowed"
            )}
            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
          >
            {pathname === item.href && !collapsed && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full" />}
            <item.icon className={cn(
              "w-5 h-5 shrink-0",
              pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-white"
            )} />
            {!collapsed && <span className="flex-1">{item.label}</span>}
            {!collapsed && item.badge && <Badge className="text-[9px] h-4 bg-muted text-muted-foreground border-none px-1">{item.badge}</Badge>}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card/90 backdrop-blur-xl border-white/10">
          <p className="text-xs font-bold">{item.label}</p>
          <p className="text-[10px] opacity-70">{item.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <aside className={cn(
      "border-r border-white/5 bg-sidebar/40 backdrop-blur-xl text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* User Block */}
      <div className="p-6 border-b border-white/5">
        <div className={cn("flex items-center gap-3 mb-6 transition-all", collapsed && "justify-center")}>
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">Alex Doe</p>
              <Badge variant="secondary" className="h-4 text-[10px] bg-primary/20 text-primary border-none px-1.5 font-bold">BUSINESS</Badge>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <span>Team Storage</span>
              <span>12%</span>
            </div>
            <Progress value={12} className="h-1.5 bg-white/5" />
            <p className="text-[10px] text-muted-foreground/40 text-right">124 GB of 1 TB used</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8 scrollbar-hide">
        <div>
          {!collapsed && <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Tools</p>}
          <div className="space-y-1">
            <NavLink item={{ icon: LayoutDashboard, label: 'Hub', href: '/dashboard', description: 'Overview' }} />
            {navItems.map((item) => <NavLink key={item.href} item={item} />)}
            <div className="pt-2">
              {toolItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Workspace</p>}
          <div className="space-y-1">
            {workspaceItems.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Support</p>}
          <div className="space-y-1">
            {supportItems.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-all mb-2"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <div className="flex items-center gap-3"><ChevronLeft className="w-5 h-5" /> <span>Collapse Sidebar</span></div>}
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
