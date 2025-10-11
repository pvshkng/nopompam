import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDossierStore } from "@/lib/stores/dossier-store";
//import Spreadsheet from "react-spreadsheet";
import { Spreadsheet, Worksheet } from "@jspreadsheet-ce/react";

// @ts-ignore
import "jsuites/dist/jsuites.css";
// @ts-ignore
import "jspreadsheet-ce/dist/jspreadsheet.css";

interface SheetData {
  columnLabels: string[];
  rowLabels: string[];
  data: string[][];
}

const PureDossierSheet = ({
  content,
  handleContentChange,
  readOnly,
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
  const spreadsheetRef = useRef<any>(null);
  const previousContentRef = useRef<string>("");
  const [worksheetData, setWorksheetData] = useState<any[][]>([[]]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    if (!content || content === previousContentRef.current) {
      return;
    }

    try {
      const parsedData = JSON.parse(content);

      // Check if it's the structured format
      if (
        parsedData &&
        typeof parsedData === "object" &&
        "data" in parsedData
      ) {
        const sheetData = parsedData as SheetData;

        // Set data
        setWorksheetData(sheetData.data.length > 0 ? sheetData.data : [[]]);

        // Set column configuration with headers
        if (sheetData.columnLabels && sheetData.columnLabels.length > 0) {
          const columnConfig = sheetData.columnLabels.map((label) => ({
            title: label,
            width: 120,
          }));
          setColumns(columnConfig);
        } else {
          setColumns([]);
        }
      }
      // Fallback: Handle legacy format (plain 2D array)
      else if (Array.isArray(parsedData)) {
        setWorksheetData(parsedData.length > 0 ? parsedData : [[]]);
        setColumns([]);
      }

      previousContentRef.current = content;
    } catch (error) {
      console.warn("Failed to parse content as JSON:", error);
      setWorksheetData([[]]);
      setColumns([]);
    }
  }, [content]);

  const handleAfterChanges = () => {
    if (readOnly || !spreadsheetRef.current) return;

    try {
      const instance = spreadsheetRef.current;
      const worksheet = instance[0];

      if (!worksheet) return;

      // Get current data
      const data = worksheet.getData();

      // Get column headers
      const headers = worksheet.getHeaders();
      const columnLabels = headers ? headers.split(",") : [];

      const sheetData: SheetData = {
        columnLabels: columnLabels,
        rowLabels: [],
        data: data,
      };

      handleContentChange(JSON.stringify(sheetData));
    } catch (error) {
      console.error("Failed to save spreadsheet data:", error);
    }
  };

  const toolbar = !readOnly
    ? [
        {
          type: "i",
          content: "undo",
          onclick: function () {
            if (spreadsheetRef.current && spreadsheetRef.current[0]) {
              spreadsheetRef.current[0].undo();
            }
          },
        },
        {
          type: "i",
          content: "redo",
          onclick: function () {
            if (spreadsheetRef.current && spreadsheetRef.current[0]) {
              spreadsheetRef.current[0].redo();
            }
          },
        },
        {
          type: "separator",
        },
        {
          type: "i",
          content: "save",
          onclick: function () {
            handleAfterChanges();
          },
        },
        {
          type: "separator",
        },
        {
          type: "select",
          k: "font-family",
          v: ["Arial", "Verdana", "Courier New", "Times New Roman"],
        },
        {
          type: "select",
          k: "font-size",
          v: ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px"],
        },
        {
          type: "i",
          content: "format_align_left",
          k: "text-align",
          v: "left",
        },
        {
          type: "i",
          content: "format_align_center",
          k: "text-align",
          v: "center",
        },
        {
          type: "i",
          content: "format_align_right",
          k: "text-align",
          v: "right",
        },
        {
          type: "i",
          content: "format_bold",
          k: "font-weight",
          v: "bold",
        },
        {
          type: "color",
          content: "format_color_text",
          k: "color",
        },
        {
          type: "color",
          content: "format_color_fill",
          k: "background-color",
        },
      ]
    : undefined;

  return (
    <div className="w-full h-full overflow-auto">
      <Spreadsheet
        ref={spreadsheetRef}
        tabs={false}
        toolbar={toolbar}
        onafterchanges={handleAfterChanges}
      >
        <Worksheet
          data={worksheetData}
          columns={columns}
          minDimensions={[10, 10]}
          allowInsertRow={!readOnly}
          allowManualInsertRow={!readOnly}
          allowInsertColumn={!readOnly}
          allowManualInsertColumn={!readOnly}
          allowDeleteRow={!readOnly}
          allowDeleteColumn={!readOnly}
          allowRenameColumn={!readOnly}
          editable={!readOnly}
        />
      </Spreadsheet>
    </div>
  );
};

export const DossierSheet = memo(PureDossierSheet);
