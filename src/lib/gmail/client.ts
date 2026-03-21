import { google } from 'googleapis';
import { getOAuth2Client } from './oauth';

export interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  body?: string;
}

export async function createGmailClient(accessToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function searchEmails(
  accessToken: string,
  query: string,
  maxResults: number = 50
): Promise<GmailMessage[]> {
  const gmail = await createGmailClient(accessToken);

  const response = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  if (!response.data.messages) return [];

  const messages: GmailMessage[] = [];
  for (const msg of response.data.messages) {
    if (!msg.id) continue;
    try {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });

      const headers = full.data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

      let body = '';
      const payload = full.data.payload;
      if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      } else if (payload?.parts) {
        const textPart = payload.parts.find(p => p.mimeType === 'text/plain');
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        } else {
          const htmlPart = payload.parts.find(p => p.mimeType === 'text/html');
          if (htmlPart?.body?.data) {
            body = Buffer.from(htmlPart.body.data, 'base64')
              .toString('utf-8')
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          }
        }
      }

      messages.push({
        id: msg.id,
        threadId: msg.threadId || '',
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        snippet: full.data.snippet || '',
        body,
      });
    } catch (err) {
      console.error(`Failed to fetch message ${msg.id}:`, err);
    }
  }

  return messages;
}

export async function getEmailContent(
  accessToken: string,
  messageId: string
): Promise<string> {
  const gmail = await createGmailClient(accessToken);

  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });

  const headers = response.data.payload?.headers || [];
  const getHeader = (name: string) =>
    headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

  let body = '';
  const payload = response.data.payload;
  if (payload?.body?.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  } else if (payload?.parts) {
    const textPart = payload.parts.find(p => p.mimeType === 'text/plain');
    if (textPart?.body?.data) {
      body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
    }
  }

  const parts = [
    `FROM: ${getHeader('From')}`,
    `TO: ${getHeader('To')}`,
    `DATE: ${getHeader('Date')}`,
    `SUBJECT: ${getHeader('Subject')}`,
    '',
    '--- EMAIL BODY ---',
    body,
  ];

  return parts.join('\n');
}

/**
 * Build a Gmail search query based on claim context
 */
export function buildSearchQuery(context: {
  parties?: string[];
  dateRange?: { start: string; end: string };
  keywords?: string[];
}): string {
  const parts: string[] = [];

  if (context.parties?.length) {
    const partyQueries = context.parties.map(p => `from:${p} OR to:${p}`);
    parts.push(`(${partyQueries.join(' OR ')})`);
  }

  if (context.dateRange) {
    parts.push(`after:${context.dateRange.start}`);
    parts.push(`before:${context.dateRange.end}`);
  }

  if (context.keywords?.length) {
    parts.push(context.keywords.join(' OR '));
  }

  return parts.join(' ');
}
