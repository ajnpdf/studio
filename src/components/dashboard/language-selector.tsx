"use client";

import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/lib/i18n/language-context';
import { languages, LanguageCode } from '@/lib/i18n/translations';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5">
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{languages.find(l => l.code === language)?.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card/90 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
        <div className="p-3">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Select Language</p>
        </div>
        <DropdownMenuSeparator className="bg-white/5 m-0" />
        <ScrollArea className="h-[350px]">
          <div className="p-1">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => setLanguage(lang.code as LanguageCode)}
                className="flex items-center justify-between gap-2 py-2.5 cursor-pointer rounded-lg px-3"
              >
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    language === lang.code ? "text-primary" : "text-muted-foreground"
                  )}>
                    {lang.native}
                  </span>
                  <span className="text-[8px] opacity-40 font-bold uppercase">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}