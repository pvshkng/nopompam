import { Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DragEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { memo } from "react";

const PureAttachment = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") ||
          (file.type.startsWith("text/") && file.size <= 2 * 1024 * 1024)
      );

      if (validFiles.length === selectedFiles.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed");
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") ||
            (file.type.startsWith("text/") && file.size <= 2 * 1024 * 1024)
        );

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Only image and text files are allowed");
        }
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) =>
          file.type.startsWith("image/") ||
          (file.type.startsWith("text/") && file.size <= 2 * 1024 * 1024)
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  return (
    <>
      <div className="flex h-full">
        <input
          type="file"
          multiple
          accept="image/*,text/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          onPaste={handlePaste}
          onDrop={handleDrop}
        />
        <button
          className={cn(
            "gap-1",
            "rounded-md",
            "bg-gradient-to-br from-blue-50 to-blue-300 text-blue-700 text-[10px]",
            "flex flex-row  size-[16px] items-center justify-center",
            "text-sm text-gray-500 hover:text-gray-700 h-full w-8"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip width={16} height={16} className="stroke-blue-700" />
          {files?.length! > 0 ? (
            <span className="text-xs text-white">{files?.length}</span>
          ) : (
            <></>
          )}
        </button>
        {files?.length! > 0 && (
          <>
            <X />
          </>
        )}
      </div>
    </>
  );
};

export const Attachment = memo(PureAttachment);
