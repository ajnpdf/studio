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

const languages = [
  { code: 'en', label: 'English (US)' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'jp', label: '日本語' },
  { code: 'cn', label: '简体中文' },
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
      <DropdownMenuContent align="end" className="w-48 bg-card/90 backdrop-blur-xl border-white/10">
        <div className="p-2 px-3">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Select Language</p>
        </div>
        <DropdownMenuSeparator className="bg-white/5" />
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setCurrentLang(lang.code)}
            className="flex items-center justify-between gap-2 py-2.5 cursor-pointer"
          >
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              currentLang === lang.code ? "text-white" : "text-muted-foreground"
            )}>
              {lang.label}
            </span>
            {currentLang === lang.code && (
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
