"use client";

import { memo, useState } from "react";
import { EditorView } from "@codemirror/view";
import { html as htmlLang } from "@codemirror/lang-html";
import { basicSetup } from "codemirror";
import CodeMirror from "@uiw/react-codemirror";
/* No Prettier needed, use CodeMirror's built-in formatting */

interface PresentationPage {
  html: string;
}

interface PresentationContent {
  pages: PresentationPage[];
  currentPage: number;
}

const parsePresentationContent = (content?: string): PresentationContent => {
  if (!content) {
    return { pages: [{ html: "<h1>New Presentation</h1>" }], currentPage: 0 };
  }
  try {
    const parsed = JSON.parse(content);
    return {
      pages: parsed.pages || [{ html: "<h1>New Presentation</h1>" }],
      currentPage: parsed.currentPage || 0,
    };
  } catch {
    // Fallback: treat as single page HTML
    return { pages: [{ html: content }], currentPage: 0 };
  }
};

const PureDossierPresentation = ({
  content,
  handleContentChange,
  readOnly,
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
  const [presentation, setPresentation] = useState<PresentationContent>(
    parsePresentationContent(content)
  );

  // Sync with external content changes
  // (If you want to support live updates from parent, add useEffect here)

  const goToPage = (idx: number) => {
    setPresentation((prev) => {
      const newState = { ...prev, currentPage: idx };
      handleContentChange(JSON.stringify(newState));
      return newState;
    });
  };

  const addPage = () => {
    if (readOnly) return;
    setPresentation((prev) => {
      const newPages = [...prev.pages, { html: "<h1>New Page</h1>" }];
      const newState = { pages: newPages, currentPage: newPages.length - 1 };
      handleContentChange(JSON.stringify(newState));
      return newState;
    });
  };

  const removePage = () => {
    if (readOnly || presentation.pages.length === 1) return;
    setPresentation((prev) => {
      const idx = prev.currentPage;
      const newPages = prev.pages.filter((_, i) => i !== idx);
      const newCurrent = Math.max(0, idx - (idx === newPages.length ? 1 : 0));
      const newState = { pages: newPages, currentPage: newCurrent };
      handleContentChange(JSON.stringify(newState));
      return newState;
    });
  };

  const updateCurrentPageHtml = (html: string) => {
    if (readOnly) return;
    setPresentation((prev) => {
      const newPages = prev.pages.map((p, i) =>
        i === prev.currentPage ? { html } : p
      );
      const newState = { ...prev, pages: newPages };
      handleContentChange(JSON.stringify(newState));
      return newState;
    });
  };

  // Use CodeMirror's built-in formatting via command
  const formatCurrentPageHtml = () => {
    if (readOnly) return;
    // This will be handled by CodeMirror's autoFormatSelection command via ref
    // For now, just trigger a re-render (actual formatting is handled in the editor)
  };

  const page = presentation.pages[presentation.currentPage];

  return (
    <div className="flex flex-row h-full w-full bg-stone-50">
      {/* Sidebar with thumbnails */}
      <div className="flex flex-col items-center py-4 px-2 gap-2 overflow-y-auto bg-white border-r border-stone-200 min-w-[80px] max-w-[120px] w-[20vw]">
        {presentation.pages.map((p, idx) => (
          <button
            key={idx}
            onClick={() => goToPage(idx)}
            className={`w-full aspect-[16/9] rounded border-2 transition-all duration-150 overflow-hidden ${
              idx === presentation.currentPage
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-stone-200 hover:border-blue-400"
            } bg-stone-100`}
            style={{ minHeight: 0, minWidth: 0 }}
            tabIndex={0}
          >
            <div
              className="w-full h-full pointer-events-none"
              dangerouslySetInnerHTML={{ __html: p.html }}
              style={{
                fontSize: "0.5rem",
                padding: "2px",
                height: "100%",
                width: "100%",
                overflow: "hidden",
              }}
            />
          </button>
        ))}
        {!readOnly && (
          <>
            <button
              onClick={addPage}
              className="mt-2 w-full py-1 rounded bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200"
            >
              + Add
            </button>
            <button
              onClick={removePage}
              className="mt-2 w-full py-1 rounded bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 disabled:opacity-50"
              disabled={presentation.pages.length === 1}
            >
              - Remove
            </button>
          </>
        )}
      </div>
      {/* Main slide and editor */}
      <div className="flex flex-col items-center justify-center p-2 gap-4">
        <div
          className="w-full max-w-[900px] aspect-[16/9] bg-white border shadow-lg flex items-center justify-center overflow-auto"
          style={{
            width: "100%",
            maxWidth: "900px",
            minWidth: "200px",
            minHeight: "120px",
          }}
        >
          <div
            className="w-full h-full overflow-auto"
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
        </div>
        {!readOnly && (
          <div className="w-full max-w-[900px]">
            <CodeMirror
              value={page.html}
              height="120px"
              extensions={[basicSetup, htmlLang()]}
              onChange={updateCurrentPageHtml}
              theme="light"
              className="border border-stone-300 rounded overflow-auto w-full"
              basicSetup={{
                lineNumbers: true,
                tabSize: 2,
              }}
              // htmlmixed mode is included in htmlLang()
            />
          </div>
        )}
        <div className="flex gap-2 items-center">
          <button
            disabled={presentation.currentPage === 0}
            onClick={() => goToPage(presentation.currentPage - 1)}
            className="px-2 py-1 border rounded bg-stone-100 hover:bg-stone-200"
          >
            Previous
          </button>
          <span>
            Page {presentation.currentPage + 1} / {presentation.pages.length}
          </span>
          <button
            disabled={
              presentation.currentPage === presentation.pages.length - 1
            }
            onClick={() => goToPage(presentation.currentPage + 1)}
            className="px-2 py-1 border rounded bg-stone-100 hover:bg-stone-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export const DossierPresentation = memo(PureDossierPresentation);
