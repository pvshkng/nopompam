import { X, File, FileText, FileSpreadsheet, Image } from "lucide-react";
import { FileAttachment } from "@/lib/stores/input-store";
import { memo } from "react";

interface FilePreviewProps {
  files: FileAttachment[];
  onRemove: (index: number) => void;
}

const getFileIcon = (mediaType: string) => {
  if (mediaType.startsWith("image/")) return Image;
  if (mediaType.includes("pdf")) return File;
  if (mediaType.includes("spreadsheet") || mediaType.includes("csv"))
    return FileSpreadsheet;
  return FileText;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const PureFilePreview = ({ files, onRemove }: FilePreviewProps) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-t">
      {files.map((file, index) => {
        const Icon = getFileIcon(file.mediaType);
        const isImage = file.mediaType.startsWith("image/");

        return (
          <div
            key={index}
            className="relative group flex items-center gap-2 p-2 pr-8 bg-secondary rounded-lg max-w-[200px]"
          >
            {isImage ? (
              <img
                src={file.url}
                alt={file.filename}
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <Icon className="w-10 h-10 text-muted-foreground" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{file.filename}</p>
              {file.size && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>

            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 bg-inherit right-1 p-1 rounded-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-700 hover:text-destructive-foreground"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const FilePreview = memo(PureFilePreview);
