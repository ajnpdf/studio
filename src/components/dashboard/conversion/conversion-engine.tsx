
"use client";

import { useState, useEffect } from 'react';
import { InputPanel } from './input-panel';
import { SettingsPanel } from './settings-panel';
import { OutputPanel } from './output-panel';
import { mockFiles } from './mock-data';

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
        filename: `${file.name.split('.')[0]}-converted`,
      }));
    }
  }, [file]);

  const handleConvert = async () => {
    setState('processing');
    setProgress(0);
    
    // Simulate conversion progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 150));
    }
    
    setState('complete');
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
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
        file={file} 
        settings={settings}
        onReset={reset}
      />
    </div>
  );
}
