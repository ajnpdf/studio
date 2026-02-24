"use client";

import { useEffect, useState } from 'react';
import { UploadedFile } from './upload-manager';
import { 
  FileIcon, 
  Shield, 
  CheckCircle2, 
  X, 
  Loader2, 
  Sparkles
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { smartToolSuggestions, type SmartToolSuggestionsOutput } from '@/ai/flows/smart-tool-suggestions';
import { ToolSuggestionCard } from './tool-suggestion-card';

interface Props {
  file: UploadedFile;
  onRemove: () => void;
  viewMode: 'grid' | 'list';
}

export function FileMetadataCard({ file, onRemove, viewMode }: Props) {
  const [suggestions, setSuggestions] = useState<SmartToolSuggestionsOutput['suggestions']>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (file.state === 'ready') {
      loadSuggestions();
    }
  }, [file.state]);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const result = await smartToolSuggestions({
        fileType: file.file.type || 'application/octet-stream',
      });
      setSuggestions(result.suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Status Header */}
          <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate max-w-[200px]">{file.file.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    {file.state === 'uploading' && 'UPLOADING...'}
                    {file.state === 'scanning' && 'SECURITY SCANNING...'}
                    {file.state === 'analyzing' && 'ANALYZING METADATA...'}
                    {file.state === 'ready' && 'READY TO PROCESS'}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-muted-foreground hover:text-red-500">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Progress / State Illustration */}
            <div className="space-y-4">
              {file.state === 'uploading' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{file.progress}%</span>
                    <span>4.2 MB/s</span>
                  </div>
                  <Progress value={file.progress} className="h-2 bg-white/5" />
                </div>
              )}

              {file.state === 'scanning' && (
                <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-pulse">
                  <div className="p-4 bg-yellow-500/10 rounded-full">
                    <Shield className="w-10 h-10 text-yellow-500" />
                  </div>
                  <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Running Security Scan</p>
                </div>
              )}

              {file.state === 'analyzing' && (
                <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-pulse">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">Detecting Metadata</p>
                </div>
              )}

              {file.state === 'ready' && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-sm font-bold uppercase tracking-widest">System Scan Complete - File Safe</span>
                </div>
              )}
            </div>

            {/* Metadata Grid */}
            {file.metadata && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Format</p>
                  <Badge className="bg-primary/20 text-primary border-none">{file.metadata.format}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Size</p>
                  <p className="text-sm font-bold">{file.metadata.size}</p>
                </div>
                {file.metadata.dimensions && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dimensions</p>
                    <p className="text-sm font-bold">{file.metadata.dimensions}</p>
                  </div>
                )}
                {file.metadata.pages && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pages</p>
                    <p className="text-sm font-bold">{file.metadata.pages} Pages</p>
                  </div>
                )}
              </div>
            )}

            {/* Tool Suggestions */}
            {file.state === 'ready' && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recommended Tools</h4>
                  </div>
                </div>

                {loadingSuggestions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestions.map((tool, idx) => (
                      <ToolSuggestionCard key={idx} tool={tool} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
