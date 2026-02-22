
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
  | 'signature';

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'signature';
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
  opacity?: number;
  rotation?: number;
}

export interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
  elements: PDFElement[];
}

export interface PDFDocument {
  id: string;
  name: string;
  totalPages: number;
  pages: PDFPage[];
}
