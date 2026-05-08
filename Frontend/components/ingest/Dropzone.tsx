"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileType } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff"],
  "audio/*": [".mp3", ".wav", ".m4a", ".flac", ".ogg", ".aac"],
  "video/*": [".mp4", ".mkv", ".avi", ".mov", ".webm"],
};

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function Dropzone({ onFiles, disabled }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) onFiles(accepted);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_EXTENSIONS,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer",
        isDragActive
          ? "border-violet-500/60 bg-violet-500/8"
          : "border-white/10 hover:border-white/20 hover:bg-white/2",
        disabled && "opacity-40 pointer-events-none"
      )}
    >
      <input {...getInputProps()} />
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl mb-3 transition-colors",
          isDragActive ? "bg-violet-500/20 text-violet-400" : "bg-white/6 text-white/40"
        )}
      >
        {isDragActive ? <FileType className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
      </div>
      {isDragActive ? (
        <p className="text-sm text-violet-400 font-medium">Drop to ingest</p>
      ) : (
        <>
          <p className="text-sm font-medium text-white/70">
            Drag files here or <span className="text-violet-400">click to upload</span>
          </p>
          <p className="mt-1 text-xs text-white/30">
            PDF, DOCX, images, audio, video — up to 50 MB
          </p>
        </>
      )}
    </div>
  );
}
