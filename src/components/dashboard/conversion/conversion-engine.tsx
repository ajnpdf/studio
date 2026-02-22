"use client";

import { useState, useEffect } from 'react';
import { InputPanel } from './input-panel';
import { SettingsPanel } from './settings-panel';
import { OutputPanel } from './output-panel';
import { PDFConverter, ConversionResult } from '@/lib/converters/pdf-converter';
import { WordConverter } from '@/lib/converters/word-converter';
import { ExcelConverter } from '@/lib/converters/excel-converter';
import { PPTConverter } from '@/lib/converters/ppt-converter';
import { ODTConverter } from '@/lib/converters/odt-converter';
import { ImageConverter } from '@/lib/converters/image-converter';
import { RawConverter } from '@/lib/converters/raw-converter';
import { VideoConverter } from '@/lib/converters/video-converter';
import { AudioConverter } from '@/lib/converters/audio-converter';
import { ArchiveConverter } from '@/lib/converters/archive-converter';
import { CodeConverter } from '@/lib/converters/code-converter';
import { EbookConverter } from '@/lib/converters/ebook-converter';
import { DesignConverter } from '@/lib/converters/design-converter';
import { CADConverter } from '@/lib/converters/cad-converter';
import { SpecializedConverter } from '@/lib/converters/specialized-converter';
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
  sampleRate: string;
  filename: string;
  saveToWorkspace: boolean;
  indent: number;
  sqlFlavor: 'mysql' | 'postgres' | 'sqlite';
}

const IMAGE_EXTS = ['JPG', 'JPEG', 'PNG', 'WEBP', 'TIFF', 'BMP', 'GIF', 'SVG', 'AVIF', 'HEIC'];
const RAW_EXTS = ['CR2', 'CR3', 'NEF', 'ARW', 'DNG', 'ORF', 'RW2', 'RAF'];
const VIDEO_EXTS = ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM', 'FLV', 'WMV', '3GP', 'TS', 'M4V'];
const AUDIO_EXTS = ['MP3', 'WAV', 'AAC', 'M4A', 'FLAC', 'OGG', 'WMA', 'AIFF', 'AMR'];
const ARCHIVE_EXTS = ['ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'ISO', 'CAB'];
const CODE_EXTS = ['JSON', 'XML', 'CSV', 'YAML', 'YML', 'HTML', 'MD', 'MARKDOWN', 'SQL'];
const EBOOK_EXTS = ['EPUB', 'MOBI', 'AZW', 'AZW3', 'FB2'];
const DESIGN_EXTS = ['PSD', 'AI', 'EPS', 'CDR'];
const CAD_EXTS = ['STL', 'OBJ', 'DXF', 'FBX', 'DWG'];
const SPECIAL_TARGETS = ['SEARCHABLE_PDF', 'REDACTED_PDF', 'FILLABLE_PDF', 'TRANSCRIPT', 'BASE64'];

export function ConversionEngine({ initialFileId }: { initialFileId: string | null }) {
  const [file, setFile] = useState<any>(null);
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
    bitrate: '192k',
    sampleRate: '44100',
    filename: '',
    saveToWorkspace: true,
    indent: 2,
    sqlFlavor: 'mysql'
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
      let realFile: File = file.file;
      let converterResult: ConversionResult;
      
      const onProgress = (p: number, msg: string) => {
        setProgress(p);
        setStatusMessage(msg);
      };

      const fmt = file.format.toUpperCase();
      const target = settings.toFormat.toUpperCase();

      if (SPECIAL_TARGETS.includes(target)) {
        const converter = new SpecializedConverter(realFile, onProgress);
        converterResult = await converter.convertTo(target, settings);
      } else if (fmt === 'PDF') {
        const converter = new PDFConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (fmt === 'DOCX' || fmt === 'DOC') {
        const converter = new WordConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (fmt === 'XLSX' || fmt === 'XLS' || fmt === 'CSV' || fmt === 'ODS') {
        if (CODE_EXTS.includes(fmt) && !['PDF', 'XLSX'].includes(settings.toFormat.toUpperCase())) {
           const converter = new CodeConverter(realFile, onProgress);
           converterResult = await converter.convertTo(settings.toFormat, settings);
        } else {
           const converter = new ExcelConverter(realFile, onProgress);
           converterResult = await converter.convertTo(settings.toFormat);
        }
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
        converterResult = await converter.convertTo(settings.toFormat, settings);
      } else if (AUDIO_EXTS.includes(fmt)) {
        const converter = new AudioConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat, settings);
      } else if (ARCHIVE_EXTS.includes(fmt)) {
        const converter = new ArchiveConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (CODE_EXTS.includes(fmt)) {
        const converter = new CodeConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat, settings);
      } else if (EBOOK_EXTS.includes(fmt)) {
        const converter = new EbookConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (DESIGN_EXTS.includes(fmt)) {
        const converter = new DesignConverter(realFile, onProgress);
        converterResult = await converter.convertTo(settings.toFormat);
      } else if (CAD_EXTS.includes(fmt)) {
        const converter = new CADConverter(realFile, onProgress);
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
