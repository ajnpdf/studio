
"use client";

import { useState, useEffect } from 'react';
import { InputPanel } from './input-panel';
import { SettingsPanel } from './settings-panel';
import { OutputPanel } from './output-panel';
import { mockFiles } from './mock-data';
import { PDFConverter, ConversionResult } from '@/lib/converters/pdf-converter';
import { WordConverter } from '@/lib/converters/word-converter';
import { ExcelConverter } from '@/lib/converters/excel-converter';
import { PPTConverter } from '@/lib/converters/ppt-converter';
import { ODTConverter } from '@/lib/converters/odt-converter';
import { ImageConverter } from '@/lib/converters/image-converter';
import { RawConverter } from '@/lib/converters/raw-converter';
import { VideoConverter } from '@/lib/converters/video-converter';
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

const IMAGE_EXTS = ['JPG', 'JPEG', 'PNG', 'WEBP', 'TIFF', 'BMP', 'GIF', 'SVG', 'AVIF', 'HEIC'];
const RAW_EXTS = ['CR2', 'CR3', 'NEF', 'ARW', 'DNG', 'ORF', 'RW2', 'RAF'];
const VIDEO_EXTS = ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM', 'FLV', 'WMV', '3GP', 'TS', 'M4V'];

export function ConversionEngine({ initialFileId }: { initialFileId: string | null }) {
  const [file, setFile] = useState<any>(mockFiles.find(f => f.id === initialFileId) || null);
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
        toFormat: '', 
      }));
    }
  }, [file]);

  const handleConvert = async () => {
    if (!settings.toFormat || !file) return;
    
    setState('processing');
    setProgress(0);
    setResult(null);

    try {
      // For demo files, we fetch a random image. For real uploaded files, we use the blob.
      let realFile: File;
      if (file.file) {
        realFile = file.file;
      } else {
        const response = await fetch(`https://picsum.photos/seed/${file.id}/800/600`);
        const blob = await response.blob();
        let mimeType = 'application/octet-stream';
        const fmt = file.format.toUpperCase();
        if (fmt === 'PDF') mimeType = 'application/pdf';
        else if (fmt === 'DOCX') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        realFile = new File([blob], file.name, { type: mimeType });
      }

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
      } else if (fmt === 'XLSX' || fmt === 'XLS' || fmt === 'CSV' || fmt === 'ODS') {
        const converter = new ExcelConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (fmt === 'PPTX' || fmt === 'PPT' || fmt === 'ODP') {
        const converter = new PPTConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (fmt === 'ODT') {
        const converter = new ODTConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (IMAGE_EXTS.includes(fmt)) {
        const converter = new ImageConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (RAW_EXTS.includes(fmt)) {
        const converter = new RawConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (VIDEO_EXTS.includes(fmt)) {
        const converter = new VideoConverter(realFile, onProgress);
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

  const handleFileUpload = (f: File) => {
    setFile({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      format: f.name.split('.').pop()?.toUpperCase() || 'UNK',
      type: f.type.split('/')[0],
      date: new Date().toLocaleDateString(),
      file: f
    });
    setResult(null);
    setState('idle');
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
      {/* LEFT PANEL — Input File */}
      <InputPanel 
        file={file} 
        onReplace={() => setFile(null)} 
        onUpload={handleFileUpload}
      />

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
