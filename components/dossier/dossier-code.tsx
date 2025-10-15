import { memo, useEffect, useRef, useState } from "react";
import { EditorState, Transaction, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { materialLight } from "@uiw/codemirror-theme-material";
import { Button } from "@/components/ui/button";
import { PlayIcon, CodeIcon, EyeIcon, Loader2 } from "lucide-react";
import DataGrid, { type Column } from "react-data-grid";
import { usePyodide } from "@/hooks/use-pyodide";
import "react-data-grid/lib/styles.css";

interface CodeContent {
  code: string;
  language: "javascript" | "typescript" | "python" | "sql" | "html";
}

interface SqlResult {
  [key: string]: any;
}

const PureDossierCode = ({
  content,
  handleContentChange,
  readOnly,
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
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
    if (!content) {
      setCodeContent({ code: "", language: "javascript" });
      return;
    }

    try {
      const parsed = JSON.parse(content) as CodeContent;
      setCodeContent(parsed);
    } catch (error) {
      console.error("Failed to parse code content:", error);
      setCodeContent({ code: content, language: "javascript" });
    }
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
      const startState = EditorState.create({
        doc: codeContent.code,
        extensions: [
          basicSetup,
          getLanguageExtension(codeContent.language),
          materialLight,
          EditorView.editable.of(!readOnly),
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
  }, []);

  // Update editor content and language
  useEffect(() => {
    if (editorRef.current) {
      const currentContent = editorRef.current.state.doc.toString();

      // Only update content if it's different AND not from user typing
      if (currentContent !== codeContent.code) {
        const transaction = editorRef.current.state.update({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: codeContent.code,
          },
          annotations: [Transaction.remote.of(true)],
        });
        editorRef.current.dispatch(transaction);
      }
    }
  }, [codeContent.code]);

  useEffect(() => {
    if (editorRef.current && !readOnly) {
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
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

      // Add the updateListener extension to the editor using dispatch
      // Use StateEffect.reconfigure instead of EditorView.reconfigure
      // Import StateEffect from @codemirror/state at the top if not already imported
      editorRef.current.dispatch({
        effects: StateEffect.reconfigure.of([
          basicSetup,
          getLanguageExtension(codeContent.language),
          materialLight,
          EditorView.editable.of(!readOnly),
          updateListener,
        ]),
      });
    }
  }, [readOnly, codeContent.language, handleContentChange]);

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
        // Capture console output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((arg) => String(arg)).join(" "));
        };

        try {
          // Execute JavaScript/TypeScript
          // Note: This is unsafe in production, use a sandboxed environment
          eval(codeContent.code);
          setOutput(logs.join("\n") || "Execution completed successfully");
        } finally {
          console.log = originalLog;
        }
      } else if (codeContent.language === "python") {
        setOutput("Loading Python environment...");

        // Load Pyodide if not already loaded
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
        // Mock SQL execution with sample data
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

  // SQL DataGrid columns
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
      {/* Toolbar */}
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
              //size="sm"
              className="rounded-none flex flex-row px-1 !py-0 !m-0"
              //variant={"ghost"}
              onClick={executeCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
              ) : (
                <PlayIcon className="w-4 h-4 text-stone-500" />
              )}
              {/* {isLoading ? "Running..." : "Run"} */}
            </button>
          )}
        </div>
      )}

      {/* Editor or Preview */}
      <div className="flex-1 overflow-hidden">
        {showPreview && codeContent.language === "html" ? (
          <div className="w-full h-full overflow-auto bg-white">
            <div dangerouslySetInnerHTML={{ __html: codeContent.code }} />
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>

      {/* TODO: wrap this with resizable */}
      {/* Output Panel */}
      {showOutput && (
        <div className="border-t bg-zinc-950 text-zinc-50">
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
            <div className="p-4 font-mono text-sm overflow-auto max-h-64">
              <pre>{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DossierCode = memo(PureDossierCode);
