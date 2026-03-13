"use client";

import { useRef, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  file: File | null;
  dragging: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

export function UploadZone({
  file,
  dragging,
  onFile,
  onClear,
  onDragEnter,
  onDragLeave,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragLeave();
      const dropped = e.dataTransfer.files[0];
      if (dropped?.type === "application/pdf") onFile(dropped);
    },
    [onFile, onDragLeave]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Zona para subir PDF"
      onClick={() => !file && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && !file && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); onDragEnter(); }}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed",
        "min-h-[200px] cursor-pointer transition-all duration-200 select-none",
        file
          ? "border-primary/50 bg-primary/5 cursor-default"
          : dragging
          ? "border-primary bg-primary/10 scale-[1.01]"
          : "border-border bg-surface hover:border-primary/40 hover:bg-surface-2"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />

      {file ? (
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground leading-snug">{file.name}</p>
            <p className="text-xs text-muted mt-0.5">
              {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="mt-1 gap-1.5 text-muted hover:text-danger hover:border-danger/40"
          >
            <X className="h-3.5 w-3.5" />
            Quitar
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center pointer-events-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 border border-border">
            <Upload className={cn("h-6 w-6 transition-colors", dragging ? "text-primary" : "text-muted")} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {dragging ? "Suelta el PDF aquí" : "Arrastra tu PDF aquí"}
            </p>
            <p className="text-xs text-muted mt-1">o haz clic para seleccionar · solo .pdf</p>
          </div>
        </div>
      )}
    </div>
  );
}
