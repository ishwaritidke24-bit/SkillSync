import fs from 'fs';
import * as pdfParseModule from 'pdf-parse';

export interface ExtractedPdfResult {
  text: string;
  numpages: number;
}

export class PdfExtractor {
  static async extractText(filePath: string): Promise<ExtractedPdfResult> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Resume file not found at ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);

    // Validate that the buffer starts with PDF header '%PDF-'
    const header = dataBuffer.slice(0, 5).toString();
    if (header !== '%PDF-') {
      throw new Error('Invalid file content: Not a valid PDF file');
    }

    try {
      const PDFParseClass = (pdfParseModule as any).PDFParse || (pdfParseModule as any).default?.PDFParse;

      if (typeof PDFParseClass === 'function') {
        const parser = new PDFParseClass(new Uint8Array(dataBuffer));
        await parser.load();
        const result = await parser.getText();
        const text = typeof result?.text === 'string' ? result.text.trim() : '';
        const numpages = result?.total || result?.pages?.length || 1;

        if (typeof parser.destroy === 'function') {
          try {
            await parser.destroy();
          } catch (_) {}
        }

        return { text, numpages };
      }

      // Fallback for function-based export
      const parseFn = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule as any).default;
      if (typeof parseFn === 'function') {
        const data = await parseFn(dataBuffer);
        return {
          text: data.text ? data.text.trim() : '',
          numpages: data.numpages || 1,
        };
      }

      throw new Error('PDF parsing library interface not recognized');
    } catch (err: any) {
      throw new Error(`Failed to parse PDF document: ${err.message || 'Corrupted or unreadable PDF'}`);
    }
  }
}
