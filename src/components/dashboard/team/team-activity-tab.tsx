
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Filter, Search, FileText, Repeat, Trash2, UserPlus, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';

const logs = [
  { member: 'Sarah Jenkins', action: 'Converted PDF to DOCX', file: 'Contract_v2.pdf', time: '2 mins ago', type: 'CONVERT', img: 'https://picsum.photos/seed/sarah/100/100' },
  { member: 'Marcus Thorne', action: 'Invited new member', file: 'j.doe@company.com', time: '15 mins ago', type: 'INVITE', img: 'https://picsum.photos/seed/marcus/100/100' },
  { member: 'Elena Rodriguez', action: 'Uploaded Video', file: 'Hero_Animation.mp4', time: '1 hour ago', type: 'UPLOAD', img: 'https://picsum.photos/seed/elena/100/100' },
  { member: 'James Wilson', action: 'Permanently Deleted', file: 'Draft_Proposal.pdf', time: '3 hours ago', type: 'DELETE', img: 'https://picsum.photos/seed/james/100/100' },
  { member: 'Sarah Jenkins', action: 'Added Watermark', file: 'Internal_Memo.pdf', time: 'Yesterday', type: 'EDIT', img: 'https://picsum.photos/seed/sarah/100/100' },
  { member: 'Linda Chen', action: 'Ran OCR Analysis', file: 'Scanned_Invoice_01.pdf', time: '2 days ago', type: 'AI', img: 'https://picsum.photos/seed/linda/100/100' },
];

export function TeamActivityTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Filter audit trail..." className="h-10 pl-10 bg-white/5 border-white/10 text-xs font-bold" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 gap-2 border-white/10 bg-white/5 text-xs font-bold">
            <Filter className="w-3.5 h-3.5" /> FILTER LOGS
          </Button>
          <Button variant="outline" className="h-10 gap-2 border-white/10 bg-white/5 text-xs font-bold">
            <Download className="w-3.5 h-3.5" /> EXPORT CSV
          </Button>
        </div>
      </div>

      <Card className="bg-card/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/10 z-10">
                <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-muted-foreground opacity-60 uppercase">{log.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={log.img} />
                          <AvatarFallback>{log.member[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">{log.member}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-1.5 h-4 border-none",
                        log.type === 'CONVERT' ? "bg-purple-500/20 text-purple-500" :
                        log.type === 'UPLOAD' ? "bg-emerald-500/20 text-emerald-500" :
                        log.type === 'DELETE' ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"
                      )}>
                        {log.type}
                      </Badge>
                      <span className="ml-2 font-medium opacity-80">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 font-bold max-w-[200px] truncate">{log.file}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-emerald-500">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase">SECURED</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
