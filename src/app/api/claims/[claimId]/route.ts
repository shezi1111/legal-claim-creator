import { NextRequest, NextResponse } from 'next/server';

// In-memory stores (shared across API routes via module cache in dev)
const claimsStore = new Map<string, Record<string, unknown>>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;
  const claim = claimsStore.get(claimId);

  if (!claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  return NextResponse.json(claim);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;
  const claim = claimsStore.get(claimId);

  if (!claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  const updates = await request.json();
  const updatedClaim = {
    ...claim,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  claimsStore.set(claimId, updatedClaim);
  return NextResponse.json(updatedClaim);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;
  const deleted = claimsStore.delete(claimId);

  if (!deleted) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
