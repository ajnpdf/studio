import { SmartHelper } from '@/components/dashboard/smart-helper';
import { FileGrid } from '@/components/dashboard/file-grid';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Manage and transform your cloud assets seamlessly.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search files, tools, actions..." className="pl-9 h-11 border-primary/10 shadow-sm" />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* AI Assistant Section */}
      <SmartHelper />

      {/* File Management Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold">Recent Files</h2>
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white shadow-sm"><LayoutGrid className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><List className="w-4 h-4" /></Button>
          </div>
        </div>

        <FileGrid />
      </section>

      {/* Activity Log / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-2xl border border-primary/5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Total Conversions</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">1,284</span>
            <span className="text-emerald-500 text-sm font-medium pb-1">+12% this month</span>
          </div>
        </div>
        <div className="p-6 bg-card rounded-2xl border border-primary/5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Space Saved</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">4.2 GB</span>
            <span className="text-emerald-500 text-sm font-medium pb-1">via Compression</span>
          </div>
        </div>
        <div className="p-6 bg-card rounded-2xl border border-primary/5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Collaboration Time</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">142h</span>
            <span className="text-primary text-sm font-medium pb-1">Total session time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
