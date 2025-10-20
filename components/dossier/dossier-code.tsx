import { memo, useEffect, useRef, useState } from "react";
import { EditorState, Transaction } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup, minimalSetup } from "codemirror";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { materialLight } from "@uiw/codemirror-theme-material";
import { noctisLilac } from "thememirror";
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
import { read } from "fs";

interface CodeContent {
  code: string;
  language: "javascript" | "typescript" | "python" | "sql" | "html";
}

interface SqlResult {
  [key: string]: any;
}

// Simplified parser that ALWAYS returns something
const parseStreamingJson = (content: string): CodeContent => {
  if (!content) {
    return { code: "", language: "javascript" };
  }

  // Try complete JSON first
  try {
    const parsed = JSON.parse(content);
    return {
      code: parsed.code || "",
      language: parsed.language || "javascript",
    };
  } catch {
    // Fallback: extract whatever we can find
    let code = "";
    let language = "javascript";

    // Extract language
    const langMatch = content.match(/"language"\s*:\s*"([^"]+)"/);
    if (langMatch) {
      language = langMatch[1];
    }

    // Extract code by finding the code field and extracting until we hit issues
    const codeMatch = content.match(/"code"\s*:\s*"([\s\S]*)$/);
    if (codeMatch) {
      // Take everything after "code":"
      let raw = codeMatch[1];

      // Remove trailing incomplete JSON
      raw = raw.replace(/[}"]*$/, "");

      // Decode escape sequences
      code = raw
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }

    return { code, language: language as any };
  }
};

const PureDossierCode = ({
  content,
  handleContentChange,
  readOnly,
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
  const lastParsedContentRef = useRef<string>("");
  const pendingUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const [codeContent, setCodeContent] = useState<CodeContent>({
    code: "",
    language: "javascript",
  });
  const [output, setOutput] = useState<string>("");
  const [sqlResults, setSqlResults] = useState<SqlResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [executing, setExecuting] = useState(false);
  const { pyodide, loadPyodide, loading: pyodideLoading } = usePyodide();

  // Parse content
  useEffect(() => {
    // Skip if content hasn't actually changed
    if (content === lastParsedContentRef.current) return;
    lastParsedContentRef.current = content || "";

    if (!content) {
      setCodeContent({ code: "", language: "javascript" });
      return;
    }

    const parsed = parseStreamingJson(content);

    // Only update if code actually changed
    setCodeContent((prev) => {
      if (prev.code === parsed.code && prev.language === parsed.language) {
        return prev;
      }
      return parsed;
    });
  }, [content]);

  // Get language extension
  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case "javascript":
      case "typescript":
        return javascript({ typescript: lang === "typescript" });
      case "python":
        return python();
      case "sql":
        return sql();
      case "html":
        return html();
      default:
        return javascript();
    }
  };

  // Initialize CodeMirror
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged && !readOnly) {
          const transaction = update.transactions.find(
            (tr) => !tr.annotation(Transaction.remote)
          );
          if (transaction) {
            const newCode = update.state.doc.toString();
            const newContent = JSON.stringify({
              code: newCode,
              language: codeContent.language,
            });
            handleContentChange(newContent);
          }
        }
      });

      const startState = EditorState.create({
        doc: "",
        extensions: [
          basicSetup,
          history(),
          keymap.of([...historyKeymap, ...defaultKeymap]),
          getLanguageExtension(codeContent.language),
          noctisLilac,
          EditorView.editable.of(!readOnly),
          ...(readOnly ? [] : [updateListener]),
        ],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor content
  useEffect(() => {
    if (!editorRef.current) return;

    const currentContent = editorRef.current.state.doc.toString();
    const newContent = codeContent.code;

    // Only update if content is different
    if (currentContent === newContent) return;

    // Clear any pending updates
    if (pendingUpdateRef.current) {
      clearTimeout(pendingUpdateRef.current);
    }

    // Debounce updates slightly to avoid cursor jumps
    pendingUpdateRef.current = setTimeout(() => {
      if (!editorRef.current) return;

      const current = editorRef.current.state.doc.toString();
      if (current === newContent) return;

      // Save cursor position
      const cursorPos = editorRef.current.state.selection.main.head;

      const transaction = editorRef.current.state.update({
        changes: {
          from: 0,
          to: current.length,
          insert: newContent,
        },
        // DON'T mark as remote to preserve undo history
        selection: readOnly
          ? undefined
          : { anchor: Math.min(cursorPos, newContent.length) },
      });
      editorRef.current.dispatch(transaction);
    }, 10);

    return () => {
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
      }
    };
  }, [codeContent.code, readOnly]);

  // Update language extension when language changes
  useEffect(() => {
    if (!editorRef.current) return;

    const currentDoc = editorRef.current.state.doc;
    const currentSelection = editorRef.current.state.selection;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !readOnly) {
        const transaction = update.transactions.find(
          (tr) => !tr.annotation(Transaction.remote)
        );
        if (transaction) {
          const newCode = update.state.doc.toString();
          const newContent = JSON.stringify({
            code: newCode,
            language: codeContent.language,
          });
          handleContentChange(newContent);
        }
      }
    });

    const newState = EditorState.create({
      doc: currentDoc,
      selection: currentSelection,
      extensions: [
        basicSetup,
        history(),
        keymap.of([...historyKeymap, ...defaultKeymap]),
        getLanguageExtension(codeContent.language),
        noctisLilac,
        EditorView.editable.of(!readOnly),
        ...(readOnly ? [] : [updateListener]),
      ],
    });

    editorRef.current.setState(newState);
  }, [codeContent.language, readOnly, handleContentChange]);

  // Execute code
  const executeCode = async () => {
    setOutput("");
    setSqlResults([]);
    setExecuting(true);

    try {
      if (
        codeContent.language === "javascript" ||
        codeContent.language === "typescript"
      ) {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((arg) => String(arg)).join(" "));
        };

        try {
          eval(codeContent.code);
          setOutput(logs.join("\n") || "Execution completed successfully");
        } finally {
          console.log = originalLog;
        }
      } else if (codeContent.language === "python") {
        setOutput("Loading Python environment...");
        const pyodideInstance = pyodide || (await loadPyodide());
        setOutput("Running Python code...");

        const outputLines: string[] = [];
        pyodideInstance.setStdout({
          batched: (output: string) => {
            outputLines.push(output);
          },
        });

        await pyodideInstance.runPythonAsync(codeContent.code);
        setOutput(outputLines.join("\n") || "Execution completed successfully");
      } else if (codeContent.language === "sql") {
        setOutput("SQL execution not implemented. Showing mock data.");
        setSqlResults([
          { id: 1, name: "Sample Row 1", value: 100 },
          { id: 2, name: "Sample Row 2", value: 200 },
          { id: 3, name: "Sample Row 3", value: 300 },
        ]);
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const sqlColumns: Column<SqlResult>[] =
    sqlResults.length > 0
      ? Object.keys(sqlResults[0]).map((key) => ({
          key,
          name: key,
          resizable: true,
        }))
      : [];

  const showOutput =
    codeContent.language !== "html" && (output || sqlResults.length > 0);

  const isLoading = executing || pyodideLoading;

  return (
    <div className="flex flex-col h-full">
      <ResizablePanelGroup direction="vertical">
        {!readOnly && (
          <div className="flex items-center gap-2 p-2 border-b">
            {codeContent.language === "html" && (
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
            {(codeContent.language === "javascript" ||
              codeContent.language === "typescript" ||
              codeContent.language === "python" ||
              codeContent.language === "sql") && (
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
            {showPreview && codeContent.language === "html" ? (
              <div className="w-full h-full overflow-auto bg-white">
                <div dangerouslySetInnerHTML={{ __html: codeContent.code }} />
              </div>
            ) : (
              <div ref={containerRef} className="w-full h-full overflow-auto" />
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
              <div className="h-full border-t-2 border-violet-300 size-full bg-violet-700 text-zinc-50">
                {codeContent.language === "sql" && sqlResults.length > 0 ? (
                  <div className="h-64">
                    <DataGrid
                      columns={sqlColumns}
                      rows={sqlResults}
                      className="rdg-dark"
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
