import type { ParseResult } from './index';

interface WhatsAppMessage {
  timestamp: string;
  sender: string;
  message: string;
  isMedia: boolean;
}

// Common WhatsApp export formats:
// [DD/MM/YYYY, HH:MM:SS] Sender: Message
// DD/MM/YYYY, HH:MM - Sender: Message
// MM/DD/YY, HH:MM AM/PM - Sender: Message
const WHATSAPP_PATTERNS = [
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]\s+([^:]+):\s+(.*)/,
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\s*[-–]\s*([^:]+):\s+(.*)/,
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\s*[-–]\s*(.*)/,
];

const MEDIA_INDICATORS = [
  '<Media omitted>',
  'image omitted',
  'video omitted',
  'audio omitted',
  'document omitted',
  'sticker omitted',
  'GIF omitted',
  'Contact card omitted',
];

const SYSTEM_MESSAGES = [
  'Messages and calls are end-to-end encrypted',
  'created group',
  'added you',
  'changed the subject',
  'changed this group',
  'changed the group description',
  'left',
  'removed',
  'joined using',
];

export function isWhatsAppExport(text: string): boolean {
  const lines = text.split('\n').slice(0, 10);
  let matchCount = 0;
  for (const line of lines) {
    for (const pattern of WHATSAPP_PATTERNS) {
      if (pattern.test(line.trim())) {
        matchCount++;
        break;
      }
    }
  }
  return matchCount >= 2;
}

export async function parseWhatsApp(buffer: Buffer, filename: string): Promise<ParseResult> {
  const text = buffer.toString('utf-8');
  const lines = text.split('\n');
  const messages: WhatsAppMessage[] = [];
  const senders = new Set<string>();
  const dates = new Set<string>();

  let currentMessage: WhatsAppMessage | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let matched = false;
    for (const pattern of WHATSAPP_PATTERNS) {
      const match = trimmed.match(pattern);
      if (match) {
        // Save previous message
        if (currentMessage) {
          messages.push(currentMessage);
        }

        const datePart = match[1];
        const timePart = match[2];
        const sender = match[3]?.trim() || 'System';
        const msg = match[4] || match[3] || '';

        const isSystemMsg = SYSTEM_MESSAGES.some(sys =>
          msg.toLowerCase().includes(sys.toLowerCase()) ||
          sender.toLowerCase().includes(sys.toLowerCase())
        );

        if (!isSystemMsg) {
          const isMedia = MEDIA_INDICATORS.some(ind =>
            msg.toLowerCase().includes(ind.toLowerCase())
          );

          currentMessage = {
            timestamp: `${datePart} ${timePart}`,
            sender,
            message: msg.trim(),
            isMedia,
          };

          senders.add(sender);
          dates.add(datePart);
        } else {
          currentMessage = null;
        }

        matched = true;
        break;
      }
    }

    // Continuation of previous message (multi-line)
    if (!matched && currentMessage) {
      currentMessage.message += '\n' + trimmed;
    }
  }

  // Don't forget the last message
  if (currentMessage) {
    messages.push(currentMessage);
  }

  // Build structured output
  const outputParts: string[] = [];
  outputParts.push(`WHATSAPP CHAT ANALYSIS`);
  outputParts.push(`File: ${filename}`);
  outputParts.push(`Total Messages: ${messages.length}`);
  outputParts.push(`Participants: ${Array.from(senders).join(', ')}`);
  outputParts.push(`Date Range: ${getDateRange(dates)}`);
  outputParts.push('');
  outputParts.push('--- FULL CONVERSATION ---');
  outputParts.push('');

  for (const msg of messages) {
    const mediaTag = msg.isMedia ? ' [MEDIA]' : '';
    outputParts.push(`[${msg.timestamp}] ${msg.sender}: ${msg.message}${mediaTag}`);
  }

  const fullText = outputParts.join('\n');
  const sortedDates = Array.from(dates).sort();

  return {
    text: fullText,
    metadata: {
      wordCount: fullText.split(/\s+/).filter(Boolean).length,
      messageCount: messages.length,
      parties: Array.from(senders),
      dateRange: sortedDates.length > 0
        ? { earliest: sortedDates[0], latest: sortedDates[sortedDates.length - 1] }
        : undefined,
    },
  };
}

function getDateRange(dates: Set<string>): string {
  const sorted = Array.from(dates).sort();
  if (sorted.length === 0) return 'Unknown';
  if (sorted.length === 1) return sorted[0];
  return `${sorted[0]} to ${sorted[sorted.length - 1]}`;
}
