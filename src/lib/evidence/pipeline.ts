import { getParser, type ParseResult } from './parsers';

export interface PipelineResult {
  evidenceId: string;
  parseResult: ParseResult | null;
  error?: string;
}

export interface EvidenceInput {
  id: string;
  buffer: Buffer;
  filename: string;
  mimeType: string;
  claimId: string;
}

/**
 * Process a single piece of evidence through the full pipeline:
 * 1. Parse the file (extract text)
 * 2. Store extracted text
 * 3. Trigger AI analysis (tagging + forensic)
 */
export async function processEvidence(input: EvidenceInput): Promise<PipelineResult> {
  const { id, buffer, filename, mimeType } = input;

  // Step 1: Parse
  const parser = getParser(mimeType);
  if (!parser) {
    return {
      evidenceId: id,
      parseResult: null,
      error: `Unsupported file type: ${mimeType}. Supported types: PDF, DOCX, images (JPG/PNG/WebP), email (.eml), WhatsApp exports (.txt)`,
    };
  }

  try {
    const parseResult = await parser(buffer, filename);

    if (!parseResult.text || parseResult.metadata.wordCount === 0) {
      return {
        evidenceId: id,
        parseResult,
        error: 'No text content could be extracted from this file.',
      };
    }

    return {
      evidenceId: id,
      parseResult,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    console.error(`Pipeline error for evidence ${id} (${filename}):`, error);

    return {
      evidenceId: id,
      parseResult: null,
      error: `Failed to process file: ${errorMessage}`,
    };
  }
}

/**
 * Process multiple evidence items in parallel
 */
export async function processEvidenceBatch(
  inputs: EvidenceInput[]
): Promise<PipelineResult[]> {
  return Promise.all(inputs.map(processEvidence));
}

/**
 * Validate file before processing
 */
export function validateFile(filename: string, mimeType: string, size: number): {
  valid: boolean;
  error?: string;
} {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size (${formatSize(size)}) exceeds maximum of 20MB.`,
    };
  }

  const parser = getParser(mimeType);
  if (!parser) {
    return {
      valid: false,
      error: `Unsupported file type: ${mimeType}. Upload PDF, DOCX, JPG, PNG, TXT (WhatsApp), or EML files.`,
    };
  }

  return { valid: true };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
