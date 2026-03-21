import mammoth from 'mammoth';
import type { ParseResult } from './index';

export async function parseDOCX(buffer: Buffer, filename: string): Promise<ParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();

    if (result.messages.length > 0) {
      console.warn(`DOCX warnings for ${filename}:`, result.messages);
    }

    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
      },
    };
  } catch (error) {
    console.error(`DOCX parse error for ${filename}:`, error);
    return {
      text: `[Unable to extract text from DOCX: ${filename}. The file may be corrupted.]`,
      metadata: {
        wordCount: 0,
      },
    };
  }
}
