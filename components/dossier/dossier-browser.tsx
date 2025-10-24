"use client";

import { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";

interface PdfContent {
  url: string;
}

const parsePdfContent = (content?: string): PdfContent => {
  if (!content) {
    return { url: "" };
  }
  try {
    const parsed = JSON.parse(content);
    return {
      url: parsed.url || "",
    };
  } catch {
    return { url: content };
  }
};

const PureDossierBrowser = ({
  content,
  handleContentChange,
  readOnly,
  textHighlights = [],
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
  textHighlights?: string[];
}) => {
  const [pdfData, setPdfData] = useState<PdfContent>(parsePdfContent(content));
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const buildPdfUrl = () => {
    if (!pdfData.url) return "";

    const params: string[] = [];

    // Add page navigation
    if (currentPage > 1) {
      params.push(`page=${currentPage}`);
    }

    // Add zoom level
    params.push(`zoom=${zoom}`);

    // Add search term for highlighting (use first highlight if available)
    if (textHighlights.length > 0) {
      params.push(`search=${encodeURIComponent(textHighlights[0])}`);
    }

    const separator = pdfData.url.includes("?") ? "&" : "#";
    return params.length > 0
      ? `${pdfData.url}${separator}${params.join("&")}`
      : pdfData.url;
  };

  return (
    <div className="flex flex-col w-full h-screen bg-background">
      {/* <div className="w-full border-b bg-background p-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={currentPage}
              onChange={(e) =>
                setCurrentPage(
                  Math.max(1, Number.parseInt(e.target.value) || 1)
                )
              }
              className="w-16 text-center"
              min={1}
            />
            <span className="text-sm text-muted-foreground">Page</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {zoom}%
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setZoom(100);
              setCurrentPage(1);
            }}
            title="Reset"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div> */}

      <div className="flex-1 w-full overflow-hidden">
        {pdfData.url ? (
          <iframe
            src={buildPdfUrl()}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Enter a PDF URL below to view
          </div>
        )}
      </div>

      {/* URL Input */}
      {/* {!readOnly && (
        <div className="w-full border-t bg-background p-3">
          <div className="max-w-7xl mx-auto">
            <Input
              type="text"
              value={pdfData.url}
              onChange={(e) => {
                setPdfData((prev) => {
                  const newState = { ...prev, url: e.target.value };
                  handleContentChange(JSON.stringify(newState));
                  return newState;
                });
              }}
              placeholder="Enter PDF URL or path"
              className="w-full"
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export const DossierBrowser = memo(PureDossierBrowser);
