
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
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser, useDoc, useFirestore, useAuth, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

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
  { icon: ShieldCheck, label: 'Admin Panel', href: '/admin', description: 'System operations', badge: 'ROOT' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', description: 'Account and preferences' },
];

const supportItems = [
  { icon: HelpCircle, label: 'Help Center', href: '/dashboard/help', description: 'Guides and FAQs' },
  { icon: Megaphone, label: "What's New", href: '/dashboard/news', description: 'Latest product updates' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [firestore, user]);

  const { data: profile } = useDoc(userProfileRef);

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
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
              pathname === item.href 
                ? "bg-white/10 text-white" 
                : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-white",
              item.disabled && "opacity-40 cursor-not-allowed"
            )}
            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
          >
            {pathname === item.href && !collapsed && <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-full" />}
            <item.icon className={cn(
              "w-5 h-5 shrink-0",
              pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-white"
            )} />
            {!collapsed && <span className="flex-1 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>}
            {!collapsed && item.badge && (
              <Badge className={cn(
                "text-[9px] h-4 border-none px-1 font-black",
                item.badge === 'ROOT' ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}>
                {item.badge}
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card/90 backdrop-blur-xl border-white/10">
          <p className="text-xs font-bold uppercase">{item.label}</p>
          <p className="text-[9px] opacity-70 uppercase font-black">{item.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const storageUsed = profile?.storageUsedBytes || 0;
  const storageLimit = (profile?.storageLimitGb || 1) * 1024 * 1024 * 1024;
  const storagePercent = Math.round((storageUsed / storageLimit) * 100) || 0;

  return (
    <aside className={cn(
      "border-r border-white/5 bg-sidebar/40 backdrop-blur-xl text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group mb-6">
          <div className="p-2 bg-white rounded-lg shadow-2xl transition-transform group-hover:scale-110">
            <Cloud className="w-5 h-5 text-black" />
          </div>
          {!collapsed && <span className="font-black text-lg tracking-tighter text-white uppercase">AJN</span>}
        </Link>

        <div className={cn("flex items-center gap-3 mb-6 transition-all", collapsed && "justify-center")}>
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/alex/100/100"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-black text-[11px] uppercase tracking-tighter truncate">{user?.displayName || 'USER ACCOUNT'}</p>
              <Badge variant="secondary" className="h-4 text-[8px] bg-white/10 text-white border-none px-1.5 font-black uppercase tracking-widest">{profile?.tier || 'FREE'}</Badge>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              <span>Vault Capacity</span>
              <span>{storagePercent}%</span>
            </div>
            <Progress value={storagePercent} className="h-1 bg-white/5 [&>div]:bg-white" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8 scrollbar-hide">
        <div>
          {!collapsed && <p className="px-3 mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Tools</p>}
          <div className="space-y-1">
            <NavLink item={{ icon: LayoutDashboard, label: 'Hub Overview', href: '/dashboard', description: 'Network Center' }} />
            {navItems.map((item) => <NavLink key={item.href} item={item} />)}
            <div className="pt-2">
              {toolItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Workspace</p>}
          <div className="space-y-1">
            {workspaceItems.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Network Support</p>}
          <div className="space-y-1">
            {supportItems.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-white transition-all mb-2"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-3"><ChevronLeft className="w-4 h-4" /> <span>Collapse Grid</span></div>}
        </button>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Disconnect</span>}
        </button>
      </div>
    </aside>
  );
}
