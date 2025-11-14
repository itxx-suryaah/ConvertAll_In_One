
"use client";

import { useState, useRef, type DragEvent, useMemo } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "../lib/utils";
import { Input } from "../components/ui/input";

type FileDropzoneProps = {
  onFilesAdded: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
  allowDirectories?: boolean;
};

const defaultAccept = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip";

export function FileDropzone({
  onFilesAdded,
  multiple = false,
  accept,
  className,
  allowDirectories = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      onFilesAdded(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      onFilesAdded(files);
    }
    // Reset the input value to allow re-selecting the same folder
    e.target.value = "";
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    type: 'file',
    onChange: handleFileSelect,
    className: 'hidden',
    'aria-hidden': 'true',
    accept: accept || defaultAccept,
  };

  if (allowDirectories) {
    // @ts-expect-error - webkitdirectory is a non-standard attribute
    inputProps.webkitdirectory = "true";
    // @ts-expect-error - directory is a non-standard attribute
    inputProps.directory = "true";
    inputProps.multiple = true;
  } else {
    inputProps.multiple = multiple;
  }


  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-card/30 p-12 text-center transition-colors duration-200 backdrop-blur-sm cursor-pointer",
        isDragging ? "border-primary bg-accent/50" : "hover:border-primary/50",
        className
      )}
    >
  <input ref={fileInputRef} {...inputProps} />
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
          <UploadCloud className="h-8 w-8" />
        </div>
        <p className="font-semibold text-foreground">
          {allowDirectories ? "Drop your files or a folder here" : "Drop your files here"}
        </p>
        <p className="text-sm">
          or click to browse from your device
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
            {allowDirectories ? (
              <>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">PDF</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">DOCX</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">XLSX</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">PPTX</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">ZIP</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">RAR</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">ISO</span>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">JPG</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">PNG</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">WebP</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">PDF</span>
                <span className="text-xs font-semibold border border-border/50 rounded-full px-3 py-1">DOCX</span>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
