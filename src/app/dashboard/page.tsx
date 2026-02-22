
"use client";

import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats-grid';
import { FileGrid } from '@/components/dashboard/file-grid';
import { DashboardRightPanel } from '@/components/dashboard/dashboard-right-panel';
import { LayoutGrid, List, Filter, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export default function DashboardPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Hub</h1>
            <p className="text-muted-foreground text-sm font-medium">Manage, transform, and optimize your workspace assets.</p>
          </header>

          {/* Quick Stats Section */}
          <DashboardStatsGrid />

          {/* Recent Files Management */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <h2 className="text-xl font-bold tracking-tight">Recent Files</h2>
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="bg-white/5 border border-white/10 h-9 p-1">
                    <TabsTrigger value="all" className="text-[10px] font-bold h-7 px-3">ALL</TabsTrigger>
                    <TabsTrigger value="pdf" className="text-[10px] font-bold h-7 px-3">PDF</TabsTrigger>
                    <TabsTrigger value="images" className="text-[10px] font-bold h-7 px-3">IMAGES</TabsTrigger>
                    <TabsTrigger value="video" className="text-[10px] font-bold h-7 px-3">VIDEO</TabsTrigger>
                    <TabsTrigger value="audio" className="text-[10px] font-bold h-7 px-3">AUDIO</TabsTrigger>
                    <TabsTrigger value="docs" className="text-[10px] font-bold h-7 px-3">DOCS</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setView('grid')}
                    className={cn("h-7 w-7 transition-all", view === 'grid' ? "bg-primary text-white shadow-sm" : "text-muted-foreground/60")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setView('list')}
                    className={cn("h-7 w-7 transition-all", view === 'list' ? "bg-primary text-white shadow-sm" : "text-muted-foreground/60")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2 text-xs font-bold border-white/10 bg-white/5">
                      <ArrowUpDown className="w-3.5 h-3.5" /> SORT
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-card/80 backdrop-blur-xl border-white/10">
                    <DropdownMenuItem className="text-xs font-bold">RECENT</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold">NAME</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold">SIZE</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold">TYPE</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" className="h-9 gap-2 text-xs font-bold border-white/10 bg-white/5">
                  <Filter className="w-3.5 h-3.5" /> FILTER
                </Button>
              </div>
            </div>

            <FileGrid view={view} />
          </section>
        </div>
      </div>
      <DashboardRightPanel />
    </div>
  );
}

import { cn } from '@/lib/utils';
