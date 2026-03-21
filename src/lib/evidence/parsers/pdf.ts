import type { ParseResult } from './index';

export async function parsePDF(buffer: Buffer, filename: string): Promise<ParseResult> {
  try {
    // Dynamic import to avoid server-side build issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfModule = await import('pdf-parse') as any;
    const pdf = pdfModule.default || pdfModule;
    const data = await pdf(buffer) as { text: string; numpages: number };
    const text = data.text.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // If very little text extracted, it might be a scanned PDF
    if (wordCount < 50) {
      return await ocrFallback(buffer, filename, data.numpages);
    }

    return {
      text,
      metadata: {
        pageCount: data.numpages,
        wordCount,
      },
    };
  } catch (error) {
    console.error(`PDF parse error for ${filename}:`, error);
    return await ocrFallback(buffer, filename);
  }
}

async function ocrFallback(
  buffer: Buffer,
  filename: string,
  pageCount?: number
): Promise<ParseResult> {
  try {
    const Tesseract = await import('tesseract.js');
    const worker = await Tesseract.createWorker('eng');
    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    const text = data.text.trim();
    return {
      text: text || `[Scanned PDF: ${filename} - OCR extracted minimal text. Manual review recommended.]`,
      metadata: {
        pageCount,
        wordCount: text.split(/\s+/).filter(Boolean).length,
      },
    };
  } catch (ocrError) {
    console.error(`OCR fallback failed for ${filename}:`, ocrError);
    return {
      text: `[Unable to extract text from PDF: ${filename}. The file may be corrupted or password-protected.]`,
      metadata: {
        pageCount,
        wordCount: 0,
      },
    };
  }
}
