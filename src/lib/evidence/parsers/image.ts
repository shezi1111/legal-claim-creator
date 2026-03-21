import type { ParseResult } from './index';

export async function parseImage(buffer: Buffer, filename: string): Promise<ParseResult> {
  try {
    const Tesseract = await import('tesseract.js');
    const worker = await Tesseract.createWorker('eng');

    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    const text = data.text.trim();

    return {
      text: text || `[Image: ${filename} - No text detected via OCR. This may be a photograph or diagram.]`,
      metadata: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
      },
    };
  } catch (error) {
    console.error(`Image OCR error for ${filename}:`, error);
    return {
      text: `[Unable to process image: ${filename}. OCR failed.]`,
      metadata: {
        wordCount: 0,
      },
    };
  }
}
