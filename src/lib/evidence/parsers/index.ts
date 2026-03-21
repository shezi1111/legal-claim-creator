import { parsePDF } from './pdf';
import { parseDOCX } from './docx';
import { parseImage } from './image';
import { parseEmail } from './email';
import { parseWhatsApp, isWhatsAppExport } from './whatsapp';

export interface ParseResult {
  text: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    dateRange?: { earliest: string; latest: string };
    parties?: string[];
    messageCount?: number;
    hasAttachments?: boolean;
  };
}

export type Parser = (buffer: Buffer, filename: string) => Promise<ParseResult>;

const PARSER_REGISTRY: Record<string, Parser> = {
  'application/pdf': parsePDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': parseDOCX,
  'image/jpeg': parseImage,
  'image/png': parseImage,
  'image/webp': parseImage,
  'message/rfc822': parseEmail,
  'text/plain': async (buffer: Buffer, filename: string) => {
    const text = buffer.toString('utf-8');
    if (isWhatsAppExport(text)) {
      return parseWhatsApp(buffer, filename);
    }
    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
      },
    };
  },
};

export function getParser(mimeType: string): Parser | null {
  return PARSER_REGISTRY[mimeType] || null;
}

export function getSupportedMimeTypes(): string[] {
  return Object.keys(PARSER_REGISTRY);
}

export { parsePDF } from './pdf';
export { parseDOCX } from './docx';
export { parseImage } from './image';
export { parseEmail } from './email';
export { parseWhatsApp } from './whatsapp';
