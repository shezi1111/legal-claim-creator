import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Use Whisper API for transcription — supports 99 languages
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'json',
    });

    return NextResponse.json({
      text: transcription.text,
      language: (transcription as unknown as Record<string, unknown>).language || 'auto-detected',
    });
  } catch (error) {
    console.error('Whisper transcription error:', error);

    // If API key not set, return a demo response
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        text: '[Voice transcription requires an OpenAI API key. Please add OPENAI_API_KEY to your environment.]',
        language: 'en',
      });
    }

    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}
