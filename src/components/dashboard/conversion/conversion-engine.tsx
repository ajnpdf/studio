"use client";

import { useState, useEffect } from 'react';
import { InputPanel } from './input-panel';
import { SettingsPanel } from './settings-panel';
import { OutputPanel } from './output-panel';
import { mockFiles } from './mock-data';
import { PDFConverter, ConversionResult } from '@/lib/converters/pdf-converter';
import { useToast } from '@/hooks/use-toast';

export type ConversionState = 'idle' | 'processing' | 'complete';

export interface ConversionSettings {
  toFormat: string;
  quality: 'low' | 'medium' | 'high';
  qualityValue: number;
  dpi: string;
  ocr: boolean;
  resolution: string;
  bitrate: string;
  filename: string;
  saveToWorkspace: boolean;
}

export function ConversionEngine({ initialFileId }: { initialFileId: string | null }) {
  const [file, setFile] = useState(mockFiles.find(f => f.id === initialFileId) || mockFiles[0]);
  const [state, setState] = useState<ConversionState>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing Engine...');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const { toast } = useToast();

  const [settings, setSettings] = useState<ConversionSettings>({
    toFormat: '',
    quality: 'medium',
    qualityValue: 80,
    dpi: '300',
    ocr: false,
    resolution: '1080p',
    bitrate: '320kbps',
    filename: '',
    saveToWorkspace: true,
  });

  useEffect(() => {
    if (file) {
      setSettings(prev => ({
        ...prev,
        filename: `${file.name.split('.')[0]}_mastered`,
      }));
    }
  }, [file]);

  const handleConvert = async () => {
    if (!settings.toFormat) return;
    
    setState('processing');
    setProgress(0);
    setResult(null);

    try {
      // In a real environment, we would fetch the actual File object from state or storage
      // For this demo, we use a mock File object to demonstrate the neural logic
      const response = await fetch(`https://picsum.photos/seed/${file.id}/800/600`);
      const blob = await response.blob();
      const realFile = new File([blob], file.name, { type: 'application/pdf' });

      const converter = new PDFConverter(realFile, (p, msg) => {
        setProgress(p);
        setStatusMessage(msg);
      });

      const conversionResult = await converter.convertTo(settings.toFormat);
      
      setResult(conversionResult);
      setState('complete');
      
      toast({
        title: "Conversion Successful",
        description: `Your ${settings.toFormat} file is ready for download.`,
      });
    } catch (err: any) {
      console.error(err);
      setState('idle');
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: err.message || "An error occurred during neural processing.",
      });
    }
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
      {/* LEFT PANEL — Input File */}
      <InputPanel file={file} onReplace={() => setFile(mockFiles[Math.floor(Math.random() * mockFiles.length)])} />

      {/* CENTER PANEL — Settings */}
      <SettingsPanel 
        file={file} 
        settings={settings} 
        setSettings={setSettings} 
        onConvert={handleConvert}
        isProcessing={state === 'processing'}
      />

      {/* RIGHT PANEL — Output Preview */}
      <OutputPanel 
        state={state} 
        progress={progress} 
        statusMessage={statusMessage}
        file={file} 
        settings={settings}
        result={result}
        onReset={reset}
      />
    </div>
  );
}
