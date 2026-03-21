import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // TODO: Clear Gmail tokens from user record in database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gmail disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail' },
      { status: 500 }
    );
  }
}
