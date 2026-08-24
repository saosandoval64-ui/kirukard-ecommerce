"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/*",
  label = "Subir imagen",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al subir.");
        return;
      }

      const { url } = await res.json();
      onChange(url);
    } catch {
      setError("Error de conexión.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-lg border border-border bg-muted text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Subiendo...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-cloud-arrow-up" />
              {label}
            </span>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-destructive hover:underline"
          >
            Eliminar
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-muted">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
