import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDossierStore } from "@/lib/stores/dossier-store";
//import Spreadsheet from "react-spreadsheet";
import { Spreadsheet, Worksheet } from "@jspreadsheet-ce/react";
import Head from "next/head";

// @ts-ignore
import "jsuites/dist/jsuites.css";
// @ts-ignore
//import "jspreadsheet-ce/dist/jspreadsheet.css";

interface SheetData {
  data: string[][];
  columns?: Array<{ title?: string; width?: string }>;
  mergeCells?: Record<string, [number, number]>;
  rows?: Record<string, { height?: string }>;
  style?: Record<string, string>;
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

        // Set column configuration
        if (sheetData.columns && sheetData.columns.length > 0) {
          setColumns(sheetData.columns);
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

      const data = worksheet.getData();

      const sheetData: SheetData = {
        data: data,
        columns: columns.length > 0 ? columns : undefined,
      };

      handleContentChange(JSON.stringify(sheetData));
    } catch (error) {
      console.error("Failed to save spreadsheet data:", error);
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Material+Icons"
        />
      </Head>
      <div className="size-full overflow-auto">
        <Spreadsheet
          ref={spreadsheetRef}
          tabs={false}
          toolbar
          onafterchanges={handleAfterChanges}
        >
          <Worksheet
            data={[worksheetData]}
            columns={[columns]}
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
        <div>{content}</div>
      </div>
    </>
  );
};

export const DossierSheet = memo(PureDossierSheet);
