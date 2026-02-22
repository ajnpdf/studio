"use client";

import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats-grid';
import { FileGrid } from '@/components/dashboard/file-grid';
import { LayoutGrid, List, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
} from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-black tracking-tighter mb-2">Hub</h1>
        <p className="text-muted-foreground text-sm">Manage, transform, and optimize your workspace assets.</p>
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
                <TabsTrigger value="all" className="text-[11px] h-7 px-3">All</TabsTrigger>
                <TabsTrigger value="pdf" className="text-[11px] h-7 px-3">PDF</TabsTrigger>
                <TabsTrigger value="images" className="text-[11px] h-7 px-3">Images</TabsTrigger>
                <TabsTrigger value="video" className="text-[11px] h-7 px-3">Video</TabsTrigger>
                <TabsTrigger value="audio" className="text-[11px] h-7 px-3">Audio</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 bg-primary text-white shadow-sm">
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/60">
                <List className="w-4 h-4" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 text-xs border-primary/20 bg-background/40">
                  <ArrowUpDown className="w-4 h-4" /> Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-card/80 backdrop-blur-xl">
                <DropdownMenuItem className="text-xs">Recent</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Name</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Size</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Type</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="h-9 gap-2 text-xs border-primary/20 bg-background/40">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        <FileGrid />
      </section>
    </div>
  );
}
