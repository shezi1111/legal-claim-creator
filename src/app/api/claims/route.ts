import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

// In-memory store for V1 (will move to Supabase)
// This allows the app to work without a database for development
const claimsStore = new Map<string, Record<string, unknown>>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jurisdiction, subJurisdiction, areaOfLaw, title } = body;

    if (!jurisdiction || !areaOfLaw) {
      return NextResponse.json(
        { error: 'Jurisdiction and area of law are required' },
        { status: 400 }
      );
    }

    const claim = {
      id: uuid(),
      userId: 'demo-user', // TODO: from auth session
      title: title || `New ${areaOfLaw} Claim`,
      jurisdiction,
      subJurisdiction: subJurisdiction || null,
      areaOfLaw,
      status: 'intake',
      factsSummary: null,
      legalIssues: null,
      strengthScore: null,
      strengthRating: null,
      strengthAnalysis: null,
      remedies: null,
      generatedLba: null,
      generatedEvidencePack: null,
      limitationDeadline: null,
      limitationWarning: null,
      opponentAnalysis: null,
      costBenefit: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    claimsStore.set(claim.id, claim);

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error('Create claim error:', error);
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const claims = Array.from(claimsStore.values()).sort(
      (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );

    return NextResponse.json({ claims, total: claims.length });
  } catch (error) {
    console.error('List claims error:', error);
    return NextResponse.json(
      { error: 'Failed to list claims' },
      { status: 500 }
    );
  }
}

// Export the store so other routes can access it
export { claimsStore };
