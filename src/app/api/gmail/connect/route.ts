import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/gmail/oauth';

export async function POST() {
  try {
    const state = JSON.stringify({
      userId: 'demo-user', // TODO: from auth session
      timestamp: Date.now(),
    });

    const authUrl = getAuthUrl(Buffer.from(state).toString('base64'));

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Gmail connect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Gmail connection' },
      { status: 500 }
    );
  }
}
