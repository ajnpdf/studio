"use client";

import { Search, Bell, LogOut, Sun, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState } from 'react';
import { BillingModal } from './billing-modal';
import { LanguageSelector } from './language-selector';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogoAnimation } from '../landing/logo-animation';
import { User } from 'lucide-react';

export function DashboardTopBar() {
  const [showBilling, setShowBilling] = useState(false);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth).then(() => router.push('/login'));
  };

  return (
    <div className="flex flex-col sticky top-0 z-30">
      <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="lg:hidden flex items-center gap-2 pr-4 border-r border-white/10">
             <LogoAnimation className="w-14 h-7" showGlow={false} />
          </div>
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Jump to tool, format, or session file..." 
              className="pl-9 bg-white/5 border-white/10 h-10 focus:ring-primary/50 font-bold text-xs" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5">
            <Sun className="w-5 h-5" />
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="h-10 w-10 relative hover:bg-white/5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 p-0 rounded-full border border-white/10 overflow-hidden">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user.photoURL || "https://picsum.photos/seed/alex/100/100"} />
                      <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2 bg-card/80 backdrop-blur-xl border-white/10">
                  <div className="flex items-center gap-3 p-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || "https://picsum.photos/seed/alex/100/100"} />
                      <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-black truncate uppercase tracking-tighter">{user.displayName || 'User Account'}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Neural Pro Member</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 py-3 cursor-pointer">
                      <User className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Account Hub</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings?tab=billing" className="flex items-center gap-3 py-3 cursor-pointer">
                      <Badge variant="outline" className="h-4 border-primary/20 text-primary text-[8px] px-1 font-black">UPGRADE</Badge>
                      <span className="text-[10px] font-black uppercase tracking-widest">Billing & Limits</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-3 py-3 cursor-pointer text-red-400 focus:text-red-400">
                    <LogOut className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Disconnect Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 border border-white/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard/upload">
                <Button className="bg-white hover:bg-white/90 text-black font-black text-[10px] h-10 px-6 rounded-xl uppercase tracking-widest shadow-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <BillingModal open={showBilling} onOpenChange={setShowBilling} />
    </div>
  );
}
