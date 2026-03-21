'use client';

import { create } from 'zustand';

export interface EvidenceItem {
  id: string;
  claimId: string;
  type: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  status: 'uploading' | 'parsing' | 'parsed' | 'analyzed' | 'error';
  extractedText?: string;
  aiSummary?: string;
  tags?: { type: string; value: string; context: string }[];
  forensicFindings?: { type: string; severity: string; title: string }[];
  source: 'upload' | 'gmail';
  createdAt: string;
}

interface EvidenceStore {
  evidence: EvidenceItem[];
  uploading: boolean;
  error: string | null;
  addEvidence: (items: EvidenceItem[]) => void;
  updateEvidence: (id: string, updates: Partial<EvidenceItem>) => void;
  removeEvidence: (id: string) => void;
  setUploading: (uploading: boolean) => void;
  setError: (error: string | null) => void;
  uploadFiles: (claimId: string, files: File[]) => Promise<void>;
}

export const useEvidenceStore = create<EvidenceStore>((set, get) => ({
  evidence: [],
  uploading: false,
  error: null,

  addEvidence: (items) =>
    set((state) => ({ evidence: [...state.evidence, ...items] })),

  updateEvidence: (id, updates) =>
    set((state) => ({
      evidence: state.evidence.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  removeEvidence: (id) =>
    set((state) => ({
      evidence: state.evidence.filter((e) => e.id !== id),
    })),

  setUploading: (uploading) => set({ uploading }),
  setError: (error) => set({ error }),

  uploadFiles: async (claimId, files) => {
    const { addEvidence, setUploading, setError } = get();
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const res = await fetch(`/api/claims/${claimId}/evidence/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const newEvidence: EvidenceItem[] = data.evidence
        .filter((e: Record<string, unknown>) => !e.error)
        .map((e: Record<string, unknown>) => ({
          id: e.id,
          claimId,
          type: e.type,
          originalFilename: e.filename,
          fileSize: e.size,
          mimeType: '',
          status: e.status as EvidenceItem['status'],
          source: 'upload' as const,
          createdAt: new Date().toISOString(),
        }));

      addEvidence(newEvidence);

      // Poll for status updates
      newEvidence.forEach((evidence) => {
        pollEvidenceStatus(evidence.id, claimId, get().updateEvidence);
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setUploading(false);
    }
  },
}));

function pollEvidenceStatus(
  evidenceId: string,
  claimId: string,
  updateEvidence: (id: string, updates: Partial<EvidenceItem>) => void
) {
  let attempts = 0;
  const maxAttempts = 30;
  const interval = setInterval(async () => {
    attempts++;
    if (attempts >= maxAttempts) {
      clearInterval(interval);
      return;
    }

    try {
      const res = await fetch(`/api/claims/${claimId}/evidence/upload`);
      if (!res.ok) return;
      // For now, just mark as parsed after a delay (will be replaced with real status check)
    } catch {
      // Ignore polling errors
    }
  }, 2000);

  // Auto-mark as parsed after 5 seconds for demo
  setTimeout(() => {
    updateEvidence(evidenceId, { status: 'parsed' });
    clearInterval(interval);
  }, 5000);
}
