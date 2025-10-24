"use client";

import { memo, useState } from "react";
import { html as htmlLang } from "@codemirror/lang-html";
import { basicSetup } from "codemirror";
import CodeMirror from "@uiw/react-codemirror";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Code,
  Eye,
  Menu,
  X,
} from "lucide-react";

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
  const [showEditor, setShowEditor] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const goToPage = (idx: number) => {
    setPresentation((prev) => {
      const newState = { ...prev, currentPage: idx };
      handleContentChange(JSON.stringify(newState));
      return newState;
    });
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
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

  const page = presentation.pages[presentation.currentPage];

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            {showSidebar ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-slate-800">
            Presentation Editor
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 hidden sm:inline">
            Page {presentation.currentPage + 1} of {presentation.pages.length}
          </span>
          {!readOnly && (
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-none transition-colors"
            >
              {showEditor ? (
                <>
                  <Eye className="w-4 h-4" />
                  {/* <span className="hidden sm:inline">Preview</span> */}
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" />
                  {/* <span className="hidden sm:inline">Edit</span> */}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop always visible, Mobile overlay */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-40 w-64 md:w-32 lg:w-32
            bg-white border-r border-slate-200 shadow-lg md:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${
              showSidebar
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
            flex flex-col
          `}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Pages
            </div>
            {presentation.pages.map((p, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                className={`
                  w-full aspect-[16/9] rounded-lg border-2 transition-all duration-200
                  overflow-hidden group relative flex items-center justify-center
                  ${
                    idx === presentation.currentPage
                      ? "border-stone-500 ring-2 ring-stone-200 shadow-md bg-stone-50"
                      : "border-slate-200 hover:border-stone-300 hover:shadow-sm bg-white hover:bg-slate-50"
                  }
                `}
              >
                <span
                  className={`text-2xl font-bold ${
                    idx === presentation.currentPage
                      ? "text-stone-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>

          {!readOnly && (
            <div className="p-4 border-t border-slate-200 space-y-2">
              <button
                onClick={addPage}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-none bg-stone-500 text-white font-medium hover:bg-stone-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={removePage}
                disabled={presentation.pages.length === 1}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-none bg-stone-300 font-medium hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile sidebar overlay backdrop */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/10 z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Slide preview */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl overflow-auto">
              <div className="w-full aspect-[16/9] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div
                  className="responsive-slide"
                  dangerouslySetInnerHTML={{ __html: page.html }}
                />
              </div>
            </div>
          </div>

          {/* Editor section */}
          {!readOnly && showEditor && (
            <div className="border-t border-slate-200 bg-white p-4 md:p-6">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-700">
                    HTML Editor
                  </label>
                  <span className="text-xs text-slate-500">
                    Edit the HTML for the current slide
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-300 shadow-sm">
                  <CodeMirror
                    value={page.html}
                    height="200px"
                    extensions={[basicSetup, htmlLang()]}
                    onChange={updateCurrentPageHtml}
                    theme="light"
                    basicSetup={{
                      lineNumbers: true,
                      tabSize: 2,
                      foldGutter: true,
                      highlightActiveLine: true,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .responsive-slide {
          width: 100%;
          height: 100%;
          padding: clamp(1rem, 3vw, 2.5rem);
          overflow: auto;
        }

        .responsive-slide :global(h1) {
          font-size: clamp(1.5rem, 4vw, 3rem);
          line-height: 1.2;
          margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
        }

        .responsive-slide :global(h2) {
          font-size: clamp(1.25rem, 3vw, 2.25rem);
          line-height: 1.3;
          margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
        }

        .responsive-slide :global(h3) {
          font-size: clamp(1.125rem, 2.5vw, 1.875rem);
          line-height: 1.4;
          margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
        }

        .responsive-slide :global(p) {
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          line-height: 1.6;
          margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
        }

        .responsive-slide :global(ul),
        .responsive-slide :global(ol) {
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          line-height: 1.6;
          margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
          padding-left: clamp(1.25rem, 3vw, 2rem);
        }

        .responsive-slide :global(li) {
          margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
        }

        .responsive-slide :global(img) {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .responsive-slide :global(button),
        .responsive-slide :global(a) {
          font-size: clamp(0.875rem, 2vw, 1rem);
          padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.5rem);
        }

        /* Responsive spacing utilities */
        .responsive-slide :global(.space-y-4 > * + *) {
          margin-top: clamp(0.75rem, 2vw, 1rem);
        }

        .responsive-slide :global(.space-y-6 > * + *) {
          margin-top: clamp(1rem, 3vw, 1.5rem);
        }

        .responsive-slide :global(.space-y-8 > * + *) {
          margin-top: clamp(1.25rem, 4vw, 2rem);
        }

        /* Ensure flex and grid layouts remain responsive */
        .responsive-slide :global(.grid) {
          gap: clamp(0.75rem, 2vw, 1.5rem);
        }

        .responsive-slide :global(.flex) {
          gap: clamp(0.5rem, 1.5vw, 1rem);
        }
      `}</style>
    </div>
  );
};

export const DossierPresentation = memo(PureDossierPresentation);
