"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "text/plain": [".txt"],
  "message/rfc822": [".eml"],
};

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

interface UploadZoneProps {
  onFilesUploaded: (files: File[]) => void;
}

export function UploadZone({ onFilesUploaded }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesUploaded(acceptedFiles);
      }
    },
    [onFilesUploaded]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all",
        isDragActive && !isDragReject
          ? "border-accent bg-accent/5"
          : isDragReject
          ? "border-danger bg-danger/5"
          : "border-border hover:border-accent/40 hover:bg-surface"
      )}
    >
      <input {...getInputProps()} />
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
          isDragActive ? "bg-accent/10" : "bg-surface"
        )}
      >
        {isDragActive ? (
          <FileUp className="h-5 w-5 text-accent" />
        ) : (
          <Upload className="h-5 w-5 text-text-light" />
        )}
      </div>
      <p className="text-sm font-medium text-text mb-1">
        {isDragActive ? "Drop files here" : "Drop files here or click to browse"}
      </p>
      <p className="text-xs text-text-light">
        PDF, DOCX, JPG, PNG, TXT, EML &mdash; Max 20MB
      </p>
    </div>
  );
}
