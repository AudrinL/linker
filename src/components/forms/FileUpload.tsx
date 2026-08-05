"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { DocumentDef } from "@/lib/forms";

const FORMAT_LABEL: Record<string, string> = {
  image: "Image",
  pdf: "PDF",
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(file: File) {
  return file.type.startsWith("image/");
}

type FileUploadProps = {
  def: DocumentDef;
  value: File | null;
  error?: string | null;
  onChange: (file: File | null) => void;
};

/**
 * Drag-and-drop document upload with preview, replace and remove.
 * Files stay in memory (frontend-only); the shape is ready for a FastAPI
 * multipart endpoint (see BACKEND_PLAN.md) later.
 */
export default function FileUpload({ def, value, error, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const acceptFile = (file: File | undefined | null) => {
    setLocalError(null);
    if (!file) return;
    const max = (def.maxMb ?? 10) * 1024 * 1024;
    if (file.size > max) {
      setLocalError(`${def.label} is ${formatBytes(file.size)} — the limit is ${def.maxMb ?? 10} MB.`);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(isImage(file) ? URL.createObjectURL(file) : null);
    onChange(file);
  };

  const remove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
  };

  const icon = def.accept === "pdf" || (!def.accept && value?.type === "application/pdf")
    ? "pdf"
    : value && isImage(value)
      ? "image"
      : "file";

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label className="eyebrow font-sans">
          {def.label}
          {!def.required && <span className="normal-case text-muted"> · optional</span>}
        </label>
        {def.hint && <span className="text-right text-xs text-muted">{def.hint}</span>}
      </div>

      {value ? (
        <div className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-mist/18 bg-white p-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={`${def.label} preview`}
              className="size-14 shrink-0 rounded-[var(--radius-xs)] border border-mist/15 object-cover"
            />
          ) : (
            <div className="grid size-14 shrink-0 place-items-center rounded-[var(--radius-xs)] bg-gold/10">
              <svg viewBox="0 0 24 24" className={cn("size-6", icon === "pdf" ? "fill-ember" : "fill-gold")} aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" className={cn(icon === "pdf" ? "fill-ember" : "fill-gold")} />
              </svg>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.95rem] font-medium tracking-tight text-bone">{value.name}</p>
            <p className="mt-0.5 text-xs text-muted">{formatBytes(value.size)} · ready</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-mist/25 px-4 py-2 text-xs font-medium text-bone transition-colors hover:border-gold/60 hover:text-gold"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={remove}
              className="rounded-full border border-ember/40 px-4 py-2 text-xs font-medium text-ember transition-colors hover:border-ember hover:bg-ember hover:text-white"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            acceptFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-dashed px-6 py-8 text-center transition-colors duration-300",
            dragOver
              ? "border-gold bg-gold/5"
              : "border-mist/25 bg-white hover:border-gold/50",
          )}
        >
          <span className="grid size-11 place-items-center rounded-full bg-gold/10">
            <svg viewBox="0 0 24 24" className="size-5 stroke-gold" fill="none" strokeWidth="1.7" aria-hidden>
              <path d="M12 16V4m0 0L7 9m5-5l5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-sm font-medium tracking-tight text-bone">
            Drag &amp; drop or <span className="text-gold">browse</span>
          </span>
          <span className="text-xs text-muted">
            {FORMAT_LABEL[icon] ?? "PDF, JPG or PNG"} · up to {def.maxMb ?? 10} MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={def.accept ?? ".pdf,.jpg,.jpeg,.png"}
        className="sr-only"
        onChange={(e) => {
          acceptFile(e.target.files?.[0]);
          e.currentTarget.value = "";
        }}
      />

      {(localError || error) && <p className="mt-2 text-xs text-ember">{localError ?? error}</p>}
    </div>
  );
}
