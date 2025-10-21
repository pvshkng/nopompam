'use client';

import { memo, useState } from "react";
// @ts-ignore
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Highlight {
  page: number;
  rect: { x: number; y: number; width: number; height: number };
}

interface PdfContent {
  url: string;
  highlights: Highlight[];
}

const parsePdfContent = (content?: string): PdfContent => {
  if (!content) {
    return { url: "", highlights: [] };
  }
  try {
    const parsed = JSON.parse(content);
    return {
      url: parsed.url || "",
      highlights: parsed.highlights || [],
    };
  } catch {
    // Fallback: treat as just URL
    return { url: content, highlights: [] };
  }
};

const PureDossierPdf = ({
  content,
  handleContentChange,
  readOnly,
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
  const [pdfData, setPdfData] = useState<PdfContent>(parsePdfContent(content));
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync with external content changes (add useEffect if needed)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Add highlight (for demo: highlight center of current page)
  const addHighlight = () => {
    if (readOnly) return;
    setPdfData((prev) => {
      const newHighlight: Highlight = {
        page: currentPage,
        rect: { x: 0.4, y: 0.4, width: 0.2, height: 0.1 }, // normalized coords
      };
      const newState = {
        ...prev,
        highlights: [...prev.highlights, newHighlight],
      };
      handleContentChange(JSON.stringify(newState));
      return newState;
    });
  };

  // Render highlights as absolutely positioned divs
  const renderHighlights = () => {
    return pdfData.highlights
      .filter((h) => h.page === currentPage)
      .map((h, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: `${h.rect.x * 100}%`,
            top: `${h.rect.y * 100}%`,
            width: `${h.rect.width * 100}%`,
            height: `${h.rect.height * 100}%`,
            background: "rgba(255,255,0,0.4)",
            pointerEvents: "none",
          }}
        />
      ));
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex gap-2 mb-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-2 py-1 border rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} / {numPages || "?"}
        </span>
        <button
          disabled={currentPage >= numPages}
          onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          className="px-2 py-1 border rounded"
        >
          Next
        </button>
        {!readOnly && (
          <button
            onClick={addHighlight}
            className="px-2 py-1 border rounded bg-yellow-100"
          >
            Highlight Center
          </button>
        )}
      </div>
      <div className="relative w-[900px] h-[1200px] border bg-white">
        <Document
          file={pdfData.url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div>Loading PDF...</div>}
        >
          <Page
            pageNumber={currentPage}
            width={900}
            renderAnnotationLayer={true}
            renderTextLayer={true}
          />
        </Document>
        {/* Highlights overlay */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {renderHighlights()}
        </div>
      </div>
      {!readOnly && (
        <input
          className="mt-4 w-[900px] border"
          type="text"
          value={pdfData.url}
          onChange={(e) => {
            setPdfData((prev) => {
              const newState = { ...prev, url: e.target.value };
              handleContentChange(JSON.stringify(newState));
              return newState;
            });
          }}
          placeholder="PDF URL or path"
        />
      )}
    </div>
  );
};

export const DossierPdf = memo(PureDossierPdf);
