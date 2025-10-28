import { memo, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { EditorState, Transaction } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { consoleLight } from "@uiw/codemirror-theme-console";
import { Button } from "@/components/ui/button";
import { PlayIcon, CodeIcon, EyeIcon, Loader2 } from "lucide-react";
import DataGrid, { type Column } from "react-data-grid";
import { usePyodide } from "@/hooks/use-pyodide";
import "react-data-grid/lib/styles.css";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { mockSqlResult } from "./dossier-code-mock";

interface SqlResult {
  [key: string]: any;
}

const PureDossierCode = ({
  kind = "python",
  content = "",
  handleContentChange,
  readOnly,
}: {
  kind: "python" | "sql" | "javascript" | "typescript" | "html";
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const isInternalUpdateRef = useRef(false);

  const [output, setOutput] = useState<string>("");
  const [sqlResults, setSqlResults] = useState<SqlResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [executing, setExecuting] = useState(false);
  const { pyodide, loadPyodide, loading: pyodideLoading } = usePyodide();

  // Memoize language extension
  const languageExtension = useMemo(() => {
    switch (kind) {
      case "javascript":
      case "typescript":
        return javascript({ typescript: kind === "typescript" });
      case "python":
        return python();
      case "sql":
        return sql();
      case "html":
        return html();
      default:
        return javascript();
    }
  }, [kind]);

  // Memoize update listener
  const updateListener = useMemo(
    () =>
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !readOnly && !isInternalUpdateRef.current) {
          const newCode = update.state.doc.toString();
          handleContentChange(newCode);
        }
      }),
    [readOnly, handleContentChange]
  );

  // Memoize extensions
  const extensions = useMemo(
    () => [
      basicSetup,
      history(),
      keymap.of([...historyKeymap, ...defaultKeymap]),
      languageExtension,
      consoleLight,
      EditorView.editable.of(!readOnly),
      ...(readOnly ? [] : [updateListener]),
    ],
    [languageExtension, readOnly, updateListener]
  );

  // Initialize CodeMirror once
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const startState = EditorState.create({
        doc: content || "",
        extensions,
      });

      editorRef.current = new EditorView({
        state: startState,
        parent: containerRef.current,
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // Only run once

  // Update editor content when content prop changes (streaming)
  useEffect(() => {
    if (!editorRef.current || content === undefined) return;

    const currentContent = editorRef.current.state.doc.toString();

    // Skip update if content is the same
    if (currentContent === content) return;

    // Mark as internal update to prevent triggering handleContentChange
    isInternalUpdateRef.current = true;

    const cursorPos = editorRef.current.state.selection.main.head;
    const isAtEnd = cursorPos >= currentContent.length;

    const transaction = editorRef.current.state.update({
      changes: {
        from: 0,
        to: currentContent.length,
        insert: content,
      },
      // Preserve cursor position, or move to end if streaming
      selection:
        readOnly || isAtEnd
          ? { anchor: content.length }
          : { anchor: Math.min(cursorPos, content.length) },
    });

    editorRef.current.dispatch(transaction);

    // Reset flag after update
    requestAnimationFrame(() => {
      isInternalUpdateRef.current = false;
    });
  }, [content, readOnly]);

  // Update extensions when language or readOnly changes
  useEffect(() => {
    if (!editorRef.current) return;

    const currentDoc = editorRef.current.state.doc;
    const currentSelection = editorRef.current.state.selection;

    isInternalUpdateRef.current = true;

    const newState = EditorState.create({
      doc: currentDoc,
      selection: currentSelection,
      extensions,
    });

    editorRef.current.setState(newState);

    requestAnimationFrame(() => {
      isInternalUpdateRef.current = false;
    });
  }, [extensions]);

  // Execute code
  const executeCode = useCallback(async () => {
    if (!editorRef.current) return;

    const code = editorRef.current.state.doc.toString();

    setOutput("");
    setSqlResults([]);
    setExecuting(true);

    try {
      if (kind === "javascript" || kind === "typescript") {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((arg) => String(arg)).join(" "));
        };

        try {
          eval(code);
          setOutput(logs.join("\n") || "Execution completed successfully");
        } finally {
          console.log = originalLog;
        }
      } else if (kind === "python") {
        setOutput("Loading Python environment...");
        const pyodideInstance = pyodide || (await loadPyodide());
        setOutput("Running Python code...");

        const outputLines: string[] = [];
        pyodideInstance.setStdout({
          batched: (output: string) => {
            outputLines.push(output);
          },
        });

        await pyodideInstance.runPythonAsync(code);
        setOutput(outputLines.join("\n") || "Execution completed successfully");
      } else if (kind === "sql") {
        setTimeout(() => {
          setOutput("SQL execution not implemented. Showing mock data.");
          setSqlResults(mockSqlResult);
        }, 1000);
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setExecuting(false);
    }
  }, [kind, pyodide, loadPyodide]);

  // Memoize SQL columns
  const sqlColumns: Column<SqlResult>[] = useMemo(
    () =>
      sqlResults.length > 0
        ? Object.keys(sqlResults[0]).map((key) => ({
            key,
            name: key,
            resizable: true,
          }))
        : [],
    [sqlResults]
  );

  const showOutput = kind !== "html" && (output || sqlResults.length > 0);
  const isLoading = executing || pyodideLoading;

  return (
    <div className="flex flex-col h-full">
      <ResizablePanelGroup direction="vertical">
        {!readOnly && (
          <div className="flex items-center gap-2 p-2 border-b">
            {kind === "html" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <CodeIcon className="w-4 h-4 mr-2" />
                ) : (
                  <EyeIcon className="w-4 h-4 mr-2" />
                )}
                {showPreview ? "Code" : "Preview"}
              </Button>
            )}
            {(kind === "javascript" ||
              kind === "typescript" ||
              kind === "python" ||
              kind === "sql") && (
              <button
                className="rounded-none flex flex-row px-1 !py-0 !m-0"
                onClick={executeCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                ) : (
                  <PlayIcon className="w-4 h-4 text-violet-500" />
                )}
              </button>
            )}
          </div>
        )}
        <ResizablePanel className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
          <div className="flex-1 overflow-hidden">
            {showPreview && kind === "html" ? (
              <div className="w-full h-full overflow-auto bg-white">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            ) : (
              <div
                ref={containerRef}
                className="w-full h-full overflow-auto [&>div]:h-full"
              />
            )}
          </div>
        </ResizablePanel>
        {showOutput && (
          <>
            <ResizableHandle
              className={cn("relative overflow-visible")}
              withHandle={false}
            />
            <ResizablePanel
              defaultSize={undefined}
              className={cn("flex flex-col h-full w-full", "bg-violet-50")}
            >
              <div className="h-full border-t-2 border-stone-300 size-full bg-stone-700 text-zinc-50">
                {kind === "sql" && sqlResults.length > 0 ? (
                  <div className="h-full">
                    <DataGrid
                      columns={sqlColumns}
                      rows={sqlResults}
                      className="rdg-dark "
                      style={{ height: "100%" }}
                    />
                  </div>
                ) : (
                  <div className="p-4 font-mono text-sm overflow-auto h-full">
                    <pre>{output}</pre>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export const DossierCode = memo(PureDossierCode);
