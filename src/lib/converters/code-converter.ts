'use client';

import jsyaml from 'js-yaml';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ProgressCallback, ConversionResult } from './pdf-converter';
import { WordConverter } from './word-converter';

/**
 * AJN Neural Code & Data Conversion Engine
 * Handles JSON, XML, CSV, YAML, HTML, Markdown, and SQL
 */
export class CodeConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async convertTo(targetFormat: string, settings: any = {}): Promise<ConversionResult> {
    const text = await this.file.text();
    const baseName = this.file.name.split('.')[0];
    const target = targetFormat.toUpperCase();
    const ext = this.file.name.split('.').pop()?.toLowerCase();

    this.updateProgress(10, `Initializing Neural Code Engine...`);

    // Routing Logic
    if (ext === 'json') {
      if (target === 'XML') return this.jsonToXml(text, baseName, settings);
      if (target === 'CSV') return this.jsonToCsv(text, baseName);
      if (target === 'YAML') return this.jsonToYaml(text, baseName, settings);
    }

    if (ext === 'xml' && target === 'JSON') return this.xmlToJson(text, baseName);

    if (ext === 'csv') {
      if (target === 'JSON') return this.csvToJson(text, baseName);
      if (target === 'SQL') return this.csvToSql(text, baseName, settings);
    }

    if (ext === 'yaml' && target === 'JSON') return this.yamlToJson(text, baseName);

    if (ext === 'html') {
      if (target === 'PDF') return this.htmlToPdf(text, baseName);
      if (target === 'DOCX') return this.htmlToDocx(text, baseName);
    }

    if (ext === 'md' || ext === 'markdown') {
      if (target === 'PDF') return this.markdownToPdf(text, baseName);
      if (target === 'DOCX') return this.markdownToDocx(text, baseName);
    }

    if (ext === 'sql' && target === 'CSV') return this.sqlToCsv(text, baseName);

    throw new Error(`Format transformation ${ext?.toUpperCase()} -> ${target} not yet supported in neural layer.`);
  }

  // --- JSON TRANSFORMS ---

  private async jsonToXml(text: string, baseName: string, settings: any): Promise<ConversionResult> {
    const obj = JSON.parse(text);
    const indent = settings.indent || 2;
    
    const sanitizeTag = (k: string) => {
      let tag = k.replace(/[^\w-]/g, '_');
      if (/^\d/.test(tag)) tag = '_' + tag;
      return tag;
    };

    const toXml = (val: any, tag: string, lvl: number): string => {
      const space = ' '.repeat(lvl * indent);
      if (Array.isArray(val)) {
        return val.map(el => toXml(el, tag, lvl)).join('\n');
      }
      if (typeof val === 'object' && val !== null) {
        const children = Object.entries(val).map(([k, v]) => toXml(v, sanitizeTag(k), lvl + 1)).join('\n');
        return `${space}<${tag}>\n${children}\n${space}</${tag}>`;
      }
      return `${space}<${tag}>${val}</${tag}>`;
    };

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, 'root', 0)}`;
    return {
      blob: new Blob([xml], { type: 'application/xml' }),
      fileName: `${baseName}.xml`,
      mimeType: 'application/xml'
    };
  }

  private async jsonToCsv(text: string, baseName: string): Promise<ConversionResult> {
    let data = JSON.parse(text);
    if (!Array.isArray(data)) data = [data];

    const allKeys = new Set<string>();
    data.forEach((item: any) => Object.keys(item).forEach(k => allKeys.add(k)));
    const headers = Array.from(allKeys);

    const escape = (val: any) => {
      const s = String(val);
      if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const rows = [
      headers.map(escape).join(','),
      ...data.map((item: any) => headers.map(h => escape(item[h] ?? '')).join(','))
    ];

    return {
      blob: new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv; charset=utf-8' }),
      fileName: `${baseName}.csv`,
      mimeType: 'text/csv'
    };
  }

  private async jsonToYaml(text: string, baseName: string, settings: any): Promise<ConversionResult> {
    const obj = JSON.parse(text);
    const yaml = jsyaml.dump(obj, { indent: settings.indent || 2, noRefs: true });
    return {
      blob: new Blob([yaml], { type: 'application/yaml' }),
      fileName: `${baseName}.yaml`,
      mimeType: 'application/yaml'
    };
  }

  // --- XML TRANSFORMS ---

  private async xmlToJson(text: string, baseName: string): Promise<ConversionResult> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    
    const nodeToJson = (node: Node): any => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() || null;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const result: any = {};
        const el = node as Element;
        
        // Attributes
        Array.from(el.attributes).forEach(attr => {
          result[`@${attr.name}`] = attr.value;
        });

        // Children
        Array.from(el.childNodes).forEach(child => {
          const val = nodeToJson(child);
          if (val === null) return;
          const name = child.nodeName;
          if (result[name]) {
            if (!Array.isArray(result[name])) result[name] = [result[name]];
            result[name].push(val);
          } else {
            result[name] = val;
          }
        });

        // Simplify text-only nodes
        const keys = Object.keys(result);
        if (keys.length === 1 && keys[0] === '#text') return result['#text'];
        return result;
      }
      return null;
    };

    const json = JSON.stringify(nodeToJson(doc.documentElement), null, 2);
    return {
      blob: new Blob([json], { type: 'application/json' }),
      fileName: `${baseName}.json`,
      mimeType: 'application/json'
    };
  }

  // --- CSV TRANSFORMS ---

  private async csvToJson(text: string, baseName: string): Promise<ConversionResult> {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const delimiter = this.detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(h => h.replace(/^"|"$/g, '').trim());
    
    const data = lines.slice(1).map(line => {
      const vals = line.split(delimiter);
      const obj: any = {};
      headers.forEach((h, i) => {
        let v = (vals[i] || '').replace(/^"|"$/g, '').trim();
        // Simple type inference
        if (!isNaN(v as any) && v !== '') obj[h] = Number(v);
        else if (v.toLowerCase() === 'true') obj[h] = true;
        else if (v.toLowerCase() === 'false') obj[h] = false;
        else obj[h] = v;
      });
      return obj;
    });

    return {
      blob: new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
      fileName: `${baseName}.json`,
      mimeType: 'application/json'
    };
  }

  private async csvToSql(text: string, baseName: string, settings: any): Promise<ConversionResult> {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const delimiter = this.detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(h => h.replace(/^"|"$/g, '').trim());
    const tableName = baseName.replace(/[^\w]/g, '_');

    let sql = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n`;
    sql += headers.map(h => `  \`${h}\` VARCHAR(255)`).join(',\n');
    sql += `\n);\n\nBEGIN;\n`;

    lines.slice(1).forEach(line => {
      const vals = line.split(delimiter).map(v => {
        const clean = v.replace(/^"|"$/g, '').trim();
        return `'${clean.replace(/'/g, "''")}'`;
      });
      sql += `INSERT INTO \`${tableName}\` (\`${headers.join('`,`')}\`) VALUES (${vals.join(',')});\n`;
    });

    sql += `COMMIT;`;

    return {
      blob: new Blob([sql], { type: 'application/sql' }),
      fileName: `${baseName}.sql`,
      mimeType: 'application/sql'
    };
  }

  // --- YAML TRANSFORMS ---

  private async yamlToJson(text: string, baseName: string): Promise<ConversionResult> {
    const obj = jsyaml.load(text);
    return {
      blob: new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }),
      fileName: `${baseName}.json`,
      mimeType: 'application/json'
    };
  }

  // --- HTML TRANSFORMS ---

  private async htmlToPdf(text: string, baseName: string): Promise<ConversionResult> {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.innerHTML = text;
    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    document.body.removeChild(container);

    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 595, (canvas.height * 595) / canvas.width);

    return {
      blob: pdf.output('blob'),
      fileName: `${baseName}.pdf`,
      mimeType: 'application/pdf'
    };
  }

  private async htmlToDocx(text: string, baseName: string): Promise<ConversionResult> {
    // Reuses the text extraction and binary synthesis from WordConverter for prototype speed
    // Ideally use a specialized HTML-to-Word library
    const converter = new WordConverter(new File([text], 'temp.html', { type: 'text/html' }));
    return converter.convertTo('DOCX');
  }

  // --- MARKDOWN TRANSFORMS ---

  private async markdownToPdf(text: string, baseName: string): Promise<ConversionResult> {
    const html = marked.parse(text);
    return this.htmlToPdf(html as string, baseName);
  }

  private async markdownToDocx(text: string, baseName: string): Promise<ConversionResult> {
    const html = marked.parse(text);
    return this.htmlToDocx(html as string, baseName);
  }

  // --- SQL TRANSFORMS ---

  private async sqlToCsv(text: string, baseName: string): Promise<ConversionResult> {
    const insertRegex = /INSERT INTO\s+`?(\w+)`?\s+\((.*?)\)\s+VALUES\s+\((.*?)\);/gi;
    let match;
    const results: any[] = [];
    
    while ((match = insertRegex.exec(text)) !== null) {
      const headers = match[2].split(',').map(h => h.trim().replace(/`/g, ''));
      const values = match[3].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      results.push(obj);
    }

    if (results.length === 0) throw new Error("No valid INSERT statements detected in SQL file.");

    return this.jsonToCsv(JSON.stringify(results), baseName);
  }

  // --- HELPERS ---

  private detectDelimiter(line: string): string {
    const counts = { ',': line.split(',').length, ';': line.split(';').length, '\t': line.split('\t').length };
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
}
