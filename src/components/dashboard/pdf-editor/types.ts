export type PDFTool = 
  | 'select' 
  | 'edit-text' 
  | 'add-text' 
  | 'insert-image' 
  | 'draw' 
  | 'shape' 
  | 'highlight' 
  | 'underline' 
  | 'strikethrough' 
  | 'comment'
  | 'signature'
  | 'form-field'
  | 'link'
  | 'redact';

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'signature' | 'form-field' | 'link' | 'markup';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  opacity?: number;
  rotation?: number;
  zIndex: number;
  // Signature specific
  signatureType?: 'draw' | 'type' | 'upload';
  signatureData?: string;
  // Form field specific
  fieldType?: 'text' | 'checkbox' | 'radio' | 'dropdown';
  isRequired?: boolean;
  // Link specific
  url?: string;
}

export interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
  elements: PDFElement[];
  isScanned?: boolean;
  ocrEnabled?: boolean;
}

export interface PDFVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  editorName: string;
  summary: string;
}

export interface PDFDocument {
  id: string;
  name: string;
  totalPages: number;
  pages: PDFPage[];
  versions: PDFVersion[];
}
