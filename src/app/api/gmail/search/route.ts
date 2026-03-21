import { NextRequest, NextResponse } from 'next/server';
import { searchEmails, buildSearchQuery } from '@/lib/gmail/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const maxResults = parseInt(searchParams.get('maxResults') || '20');

  // TODO: Get access token from user session
  const accessToken = ''; // Will be populated from auth

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Gmail not connected. Please connect your Gmail account first.' },
      { status: 401 }
    );
  }

  try {
    const searchQuery = query || buildSearchQuery({});
    const emails = await searchEmails(accessToken, searchQuery, maxResults);

    return NextResponse.json({
      emails: emails.map(e => ({
        id: e.id,
        from: e.from,
        to: e.to,
        subject: e.subject,
        date: e.date,
        snippet: e.snippet,
      })),
      total: emails.length,
    });
  } catch (error) {
    console.error('Gmail search error:', error);
    return NextResponse.json(
      { error: 'Failed to search Gmail' },
      { status: 500 }
    );
  }
}
