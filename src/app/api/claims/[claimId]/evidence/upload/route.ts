import { NextRequest, NextResponse } from 'next/server';
import { processEvidence } from '@/lib/evidence/pipeline';
import { validateFile } from '@/lib/evidence/pipeline';

// In-memory evidence store for V1
const evidenceStore = new Map<string, Record<string, unknown>>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      // Validate
      const validation = validateFile(file.name, file.type, file.size);
      if (!validation.valid) {
        results.push({
          filename: file.name,
          error: validation.error,
          status: 'error',
        });
        continue;
      }

      const evidenceId = crypto.randomUUID();
      const buffer = Buffer.from(await file.arrayBuffer());

      // Create evidence record
      const evidence = {
        id: evidenceId,
        claimId,
        type: getEvidenceType(file.type),
        originalFilename: file.name,
        storagePath: `/evidence/${claimId}/${evidenceId}`,
        fileSize: file.size,
        mimeType: file.type,
        status: 'parsing',
        extractedText: null as string | null,
        aiSummary: null,
        aiAnalysis: null,
        tags: [] as unknown[],
        forensicFindings: [] as unknown[],
        source: 'upload',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      evidenceStore.set(evidenceId, evidence);

      // Process in background (parse text)
      processEvidence({
        id: evidenceId,
        buffer,
        filename: file.name,
        mimeType: file.type,
        claimId,
      }).then(result => {
        if (result.parseResult) {
          evidence.extractedText = result.parseResult.text;
          evidence.status = 'parsed';
          evidence.updatedAt = new Date().toISOString();
          evidenceStore.set(evidenceId, { ...evidence, metadata: result.parseResult.metadata });
        } else {
          evidence.status = 'error';
          evidence.updatedAt = new Date().toISOString();
          evidenceStore.set(evidenceId, evidence);
        }
      }).catch(err => {
        console.error(`Evidence processing failed for ${evidenceId}:`, err);
        evidence.status = 'error';
        evidenceStore.set(evidenceId, evidence);
      });

      results.push({
        id: evidenceId,
        filename: file.name,
        type: evidence.type,
        status: 'parsing',
        size: file.size,
      });
    }

    return NextResponse.json({ evidence: results }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

function getEvidenceType(mimeType: string): string {
  const typeMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/webp': 'image',
    'message/rfc822': 'eml',
    'text/plain': 'text',
  };
  return typeMap[mimeType] || 'unknown';
}

export { evidenceStore };
