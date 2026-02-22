
"use client";

import { Search, Bell, Plus, Menu, User, Settings, LogOut, AlertCircle, Info } from 'lucide-react';
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
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function DashboardTopBar() {
  const [showBilling, setShowBilling] = useState(false);
  const [storageUsedPercent] = useState(82); 
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth).then(() => router.push('/login'));
  };

  return (
    <div className="flex flex-col sticky top-0 z-30">
      {/* Dynamic Storage Warning Banners */}
      {storageUsedPercent >= 95 ? (
        <div className="h-10 bg-white flex items-center justify-center gap-3 px-4 animate-in slide-in-from-top duration-500">
          <AlertCircle className="w-4 h-4 text-black" />
          <p className="text-[10px] font-black text-black uppercase tracking-widest">
            Workspace storage is 95% full. Actions are currently restricted.
          </p>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => setShowBilling(true)}
            className="h-6 bg-black text-white hover:bg-black/90 text-[9px] font-black uppercase px-3"
          >
            Upgrade Now
          </Button>
        </div>
      ) : storageUsedPercent >= 80 ? (
        <div className="h-10 border-b border-white/10 bg-black flex items-center justify-center gap-3 px-4 animate-in slide-in-from-top duration-500">
          <Info className="w-4 h-4 text-white" />
          <p className="text-[10px] font-black text-white uppercase tracking-widest">
            Warning: Workspace storage is 82% full.
          </p>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => setShowBilling(true)}
            className="h-6 bg-white text-black hover:bg-white/90 text-[9px] font-black uppercase px-3"
          >
            Manage Storage
          </Button>
        </div>
      ) : null}

      <header className="h-16 border-b border-white/5 bg-background/20 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search files, tools, formats..." 
              className="pl-9 bg-background/40 border-white/10 h-10 focus:ring-white/20" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          <Link href="/dashboard/upload">
            <Button className="bg-white hover:bg-white/90 text-black font-black text-[10px] h-10 gap-2 px-4 rounded-xl uppercase tracking-widest transition-all hover:scale-105">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Upload</span>
            </Button>
          </Link>

          <div className="relative">
            <Button variant="ghost" size="icon" className="h-10 w-10 relative hover:bg-white/5">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-white text-black text-[10px] font-black border-none">3</Badge>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 p-0 rounded-full border border-white/10">
                <Avatar className="h-full w-full">
                  <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 bg-card/80 backdrop-blur-xl border-white/10">
              <div className="flex items-center gap-3 p-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-black truncate uppercase tracking-tighter">Alex Doe</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Free Workspace</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-3 py-2.5 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Profile & Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings?tab=billing" className="flex items-center gap-3 py-2.5 cursor-pointer">
                  <Badge variant="outline" className="h-4 border-white/20 text-[8px] px-1 font-black">PRO</Badge>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Billing & Tier</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings?tab=preferences" className="flex items-center gap-3 py-2.5 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Preferences</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-3 py-2.5 cursor-pointer text-red-400 focus:text-red-400">
                <LogOut className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <BillingModal open={showBilling} onOpenChange={setShowBilling} />
    </div>
  );
}
