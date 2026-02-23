"use client";

import { 
  Network, 
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
  ChevronRight,
  ShieldCheck,
  LogIn,
  Activity,
  Cpu,
  Grid2X2,
  Workflow
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { LogoAnimation } from '@/components/landing/logo-animation';

const navItems = [
  { icon: Repeat, label: 'Junction Core', href: '/dashboard/convert', description: 'Universal format engine' },
  { icon: Grid2X2, label: 'All Units', href: '/dashboard/tools', description: 'Network directory hub' },
];

const toolItems = [
  { icon: FileText, label: 'PDF Mastery', href: '/dashboard/pdf-editor', description: 'Smart PDF Studio' },
  { icon: ImageIcon, label: 'Image Mastery', href: '/dashboard/image-editor', description: 'Image Optimizer' },
  { icon: Video, label: 'Video Lab', href: '/dashboard/tools/video', description: 'FFmpeg transcode' },
  { icon: Music, label: 'Audio Studio', href: '/dashboard/tools/audio', description: 'Track surgery' },
  { icon: Box, label: 'Batch Center', href: '/dashboard/tools/batch', description: 'Multi-file tasks' },
  { icon: BrainCircuit, label: 'Smart Intelligence', href: '/dashboard/tools/ai', description: 'Semantic analysis' },
];

const workspaceItems = [
  { icon: Users, label: 'Node Team', href: '/dashboard/team', description: 'Multi-user sync' },
  { icon: Wand2, label: 'API Gateway', href: '/dashboard/api', description: 'Developer control' },
  { icon: ShieldCheck, label: 'Root Ops', href: '/admin', description: 'System core', badge: 'ROOT' },
  { icon: Settings, label: 'Node Config', href: '/dashboard/settings', description: 'Session prefs' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    signOut(auth).then(() => router.push('/login'));
  };

  const NavLink = ({ item }: { item: any }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.disabled ? '#' : item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
              pathname === item.href 
                ? "bg-primary text-white shadow-xl shadow-primary/20" 
                : "text-slate-600 hover:bg-black/5 hover:text-slate-900",
              item.disabled && "opacity-40 cursor-not-allowed"
            )}
            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
          >
            <item.icon className={cn(
              "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
              pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-primary"
            )} />
            {!collapsed && <span className="flex-1 text-[11px] font-black uppercase tracking-widest">{item.label}</span>}
            {!collapsed && item.badge && (
              <Badge className="text-[8px] h-4 bg-primary/10 text-primary border-none px-1 font-black">
                {item.badge}
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white/95 backdrop-blur-xl border-black/5 p-3 rounded-xl shadow-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-slate-900">{item.label}</p>
          <p className="text-[9px] opacity-60 uppercase font-bold mt-1 text-slate-600">{item.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <aside className={cn(
      "border-r border-black/5 bg-white/40 backdrop-blur-3xl text-slate-900 flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-500",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Brand Header */}
      <div className="p-6 border-b border-black/5">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <LogoAnimation className="w-16 h-8 md:w-20 md:h-10" showGlow={false} />
          {!collapsed && <span className="font-black text-xl tracking-tighter text-slate-900 uppercase ml-[-8px]">AJN</span>}
        </Link>

        {user ? (
          <div className={cn("flex items-center gap-3 transition-all", collapsed && "justify-center")}>
            <Avatar className="h-10 w-10 border-2 border-white ring-4 ring-primary/5">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-black">OP</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-black text-[11px] uppercase tracking-tighter truncate text-slate-900">{user?.displayName || 'OPERATOR'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">ACTIVE NODE</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={cn("flex items-center gap-3 transition-all", collapsed && "justify-center")}>
            <div className="h-10 w-10 bg-black/5 rounded-xl border border-black/5 flex items-center justify-center">
              <Activity className="w-5 h-5 text-muted-foreground animate-pulse" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-black text-[11px] uppercase tracking-tighter truncate text-muted-foreground/60">GUEST SESSION</p>
                <Badge variant="outline" className="h-4 text-[8px] border-black/5 text-slate-900/40 border-none px-1.5 font-black uppercase tracking-widest mt-1">LIMITED</Badge>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-10 scrollbar-hide">
        <div>
          {!collapsed && <p className="px-3 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Operation Core</p>}
          <div className="space-y-1">
            <NavLink item={{ icon: LayoutDashboard, label: 'Services Hub', href: '/dashboard', description: 'Network Center' }} />
            {navItems.map((item) => <NavLink key={item.href} item={item} />)}
            <div className="pt-4 mt-4 border-t border-black/5">
              {!collapsed && <p className="px-3 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Service Units</p>}
              {toolItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Infrastructure</p>}
          <div className="space-y-1">
            {workspaceItems.map((item) => (
              <div key={item.href} className={!user ? "opacity-20 pointer-events-none grayscale" : ""}>
                <NavLink item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-black/5 bg-white/20">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-slate-900 hover:bg-black/5 transition-all mb-2"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-3"><ChevronLeft className="w-4 h-4" /> <span>Minimize Grid</span></div>}
        </button>
        {user ? (
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Disconnect Node</span>}
          </button>
        ) : (
          <Link href="/login">
            <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all">
              <LogIn className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Auth Access</span>}
            </button>
          </Link>
        )}
      </div>
    </aside>
  );
}