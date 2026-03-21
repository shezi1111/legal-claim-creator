import { simpleParser } from 'mailparser';
import type { ParseResult } from './index';

export async function parseEmail(buffer: Buffer, filename: string): Promise<ParseResult> {
  try {
    const parsed = await simpleParser(buffer);

    const parts: string[] = [];

    parts.push(`FROM: ${parsed.from?.text || 'Unknown'}`);
    parts.push(`TO: ${parsed.to ? (Array.isArray(parsed.to) ? parsed.to.map(t => t.text).join(', ') : parsed.to.text) : 'Unknown'}`);
    if (parsed.cc) {
      const ccText = Array.isArray(parsed.cc) ? parsed.cc.map(c => c.text).join(', ') : parsed.cc.text;
      parts.push(`CC: ${ccText}`);
    }
    parts.push(`DATE: ${parsed.date?.toISOString() || 'Unknown'}`);
    parts.push(`SUBJECT: ${parsed.subject || 'No Subject'}`);
    parts.push('');
    parts.push('--- EMAIL BODY ---');
    const htmlText = typeof parsed.html === 'string' ? parsed.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : null;
    parts.push(parsed.text || htmlText || '[No body content]');

    if (parsed.attachments && parsed.attachments.length > 0) {
      parts.push('');
      parts.push('--- ATTACHMENTS ---');
      parsed.attachments.forEach((att, i) => {
        parts.push(`${i + 1}. ${att.filename || 'unnamed'} (${att.contentType}, ${formatFileSize(att.size)})`);
      });
    }

    const text = parts.join('\n');
    const parties: string[] = [];
    if (parsed.from?.value) {
      parsed.from.value.forEach(addr => {
        if (addr.name) parties.push(addr.name);
      });
    }

    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
        parties,
        hasAttachments: (parsed.attachments?.length || 0) > 0,
        dateRange: parsed.date ? {
          earliest: parsed.date.toISOString().split('T')[0],
          latest: parsed.date.toISOString().split('T')[0],
        } : undefined,
      },
    };
  } catch (error) {
    console.error(`Email parse error for ${filename}:`, error);
    return {
      text: `[Unable to parse email file: ${filename}. The file may be corrupted or in an unsupported format.]`,
      metadata: { wordCount: 0 },
    };
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
