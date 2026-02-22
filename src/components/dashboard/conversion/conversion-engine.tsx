"use client";

import { useState, useEffect } from 'react';
import { InputPanel } from './input-panel';
import { SettingsPanel } from './settings-panel';
import { OutputPanel } from './output-panel';
import { mockFiles } from './mock-data';
import { PDFConverter, ConversionResult } from '@/lib/converters/pdf-converter';
import { WordConverter } from '@/lib/converters/word-converter';
import { ExcelConverter } from '@/lib/converters/excel-converter';
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
        toFormat: '', // Reset on file change
      }));
    }
  }, [file]);

  const handleConvert = async () => {
    if (!settings.toFormat) return;
    
    setState('processing');
    setProgress(0);
    setResult(null);

    try {
      // Simulate real file fetch for demo
      const response = await fetch(`https://picsum.photos/seed/${file.id}/800/600`);
      const blob = await response.blob();
      
      let mimeType = 'application/octet-stream';
      if (file.format === 'PDF') mimeType = 'application/pdf';
      else if (file.format === 'DOCX') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (file.format === 'XLSX') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      else if (file.format === 'CSV') mimeType = 'text/csv';

      const realFile = new File([blob], file.name, { type: mimeType });

      let converterResult: ConversionResult;

      const onProgress = (p: number, msg: string) => {
        setProgress(p);
        setStatusMessage(msg);
      };

      const fmt = file.format.toUpperCase();

      if (fmt === 'PDF') {
        const converter = new PDFConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (fmt === 'DOCX' || fmt === 'DOC') {
        const converter = new WordConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (fmt === 'XLSX' || fmt === 'XLS' || fmt === 'CSV') {
        const converter = new ExcelConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else {
        throw new Error(`Engine for ${file.format} is currently in calibration.`);
      }
      
      setResult(converterResult);
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
