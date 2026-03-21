'use client';

import { useCallback } from 'react';
import { useEvidenceStore } from '@/stores/evidence-store';

export function useEvidence(claimId: string) {
  const {
    evidence,
    uploading,
    error,
    uploadFiles,
    removeEvidence,
    setError,
  } = useEvidenceStore();

  const claimEvidence = evidence.filter((e) => e.claimId === claimId);

  const handleUpload = useCallback(
    async (files: File[]) => {
      await uploadFiles(claimId, files);
    },
    [claimId, uploadFiles]
  );

  const handleRemove = useCallback(
    (evidenceId: string) => {
      removeEvidence(evidenceId);
    },
    [removeEvidence]
  );

  const dismissError = useCallback(() => {
    setError(null);
  }, [setError]);

  const stats = {
    total: claimEvidence.length,
    parsed: claimEvidence.filter((e) => e.status === 'parsed' || e.status === 'analyzed').length,
    analyzing: claimEvidence.filter((e) => e.status === 'parsing').length,
    errors: claimEvidence.filter((e) => e.status === 'error').length,
  };

  return {
    evidence: claimEvidence,
    uploading,
    error,
    stats,
    uploadFiles: handleUpload,
    removeEvidence: handleRemove,
    dismissError,
  };
}
