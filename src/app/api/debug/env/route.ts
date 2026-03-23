import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasOpenAiKey: !!process.env.OPENAI_API_KEY,
    hasGoogleAiKey: !!process.env.GOOGLE_AI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
  });
}
