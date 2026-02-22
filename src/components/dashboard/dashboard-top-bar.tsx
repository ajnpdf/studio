
"use client";

import { Search, Bell, Plus, Menu, User, Settings, LogOut } from 'lucide-react';
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

export function DashboardTopBar() {
  return (
    <header className="h-16 border-b bg-background/20 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search files, tools, formats..." 
            className="pl-9 bg-background/40 border-primary/10 h-10 focus:ring-primary/50" 
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/upload">
          <Button className="bg-brand-gradient hover:opacity-90 shadow-lg text-white font-bold h-10 gap-2 px-4">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Upload</span>
          </Button>
        </Link>

        <div className="relative">
          <Button variant="ghost" size="icon" className="h-10 w-10 relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-[10px] border-none">3</Badge>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full border-2 border-primary/20">
              <Avatar className="h-full w-full">
                <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 bg-card/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold">Alex Doe</p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="w-4 h-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="w-4 h-4" /> Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive">
              <LogOut className="w-4 h-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
