
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Users,
  ArrowUpDown
} from 'lucide-react';

export function UsersTab() {
  const [search, setSearch] = useState('');
  const users: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 bg-white/5 border-white/10 font-bold text-xs" 
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 border-white/10 bg-white/5 font-bold text-[10px] gap-2 uppercase">
            <Filter className="w-3.5 h-3.5" /> FILTERS
          </Button>
          <Button variant="outline" className="h-11 border-white/10 bg-white/5 font-bold text-[10px] gap-2 uppercase">
            <ArrowUpDown className="w-3.5 h-3.5" /> SORT
          </Button>
        </div>
      </div>

      <Card className="bg-card/40 border-white/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="py-32 text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-muted-foreground/10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tighter">Database Clean</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">No user records currently found in the network database.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
