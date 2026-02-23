"use client";

import { useState } from 'react';
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

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'ru', label: 'Pусский' },
  { code: 'ko', label: '한국어' },
  { code: 'zh-CN', label: '中文 (简体)' },
  { code: 'zh-TW', label: '中文 (繁體)' },
  { code: 'ar', label: 'العربية' },
  { code: 'bg', label: 'Български' },
  { code: 'ca', label: 'Català' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'pl', label: 'Polski' },
  { code: 'sv', label: 'Svenska' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'uk', label: 'Українська' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'te', label: 'తెలుగు' },
];

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('en');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5">
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{languages.find(l => l.code === currentLang)?.label}</span>
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
                onClick={() => setCurrentLang(lang.code)}
                className="flex items-center justify-between gap-2 py-2.5 cursor-pointer rounded-lg px-3"
              >
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  currentLang === lang.code ? "text-primary" : "text-muted-foreground"
                )}>
                  {lang.label}
                </span>
                {currentLang === lang.code && (
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
