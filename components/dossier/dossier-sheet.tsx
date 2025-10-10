import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDossierStore } from "@/lib/stores/dossier-store";
import Spreadsheet from "react-spreadsheet";

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
  const [data, setData] = useState<any[][]>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const previousContentRef = useRef<string>("");

  useEffect(() => {
    if (content && content !== previousContentRef.current) {
      try {
        const parsedData = JSON.parse(content);

        // Check if it's the new structured format
        if (
          parsedData &&
          typeof parsedData === "object" &&
          "data" in parsedData
        ) {
          const sheetData = parsedData as SheetData;

          // Format data for Spreadsheet component
          const formattedData = sheetData.data.map((row) =>
            row.map((cell) => ({ value: cell }))
          );

          setData(formattedData);
          setColumnLabels(sheetData.columnLabels || []);
          setRowLabels(sheetData.rowLabels || []);
        }
        // Fallback: Handle legacy format (plain 2D array)
        else if (Array.isArray(parsedData)) {
          const formattedData = parsedData.map((row) =>
            Array.isArray(row) ? row.map((cell) => ({ value: cell })) : []
          );
          setData(formattedData);
          setColumnLabels([]);
          setRowLabels([]);
        } else {
          console.warn(
            "Parsed content is not in expected format, using empty array"
          );
          setData([]);
          setColumnLabels([]);
          setRowLabels([]);
        }
      } catch (error) {
        console.warn("Failed to parse content as JSON:", error);
        setData([]);
        setColumnLabels([]);
        setRowLabels([]);
      }

      previousContentRef.current = content;
    }
  }, [content]);

  const handleChange = (newData: any[][]) => {
    if (!readOnly) {
      const rawData = newData.map((row) =>
        row.map((cell) => cell?.value ?? "")
      );

      // Save in the structured format
      const sheetData: SheetData = {
        columnLabels,
        rowLabels,
        data: rawData,
      };

      handleContentChange(JSON.stringify(sheetData));
    }
  };

  return (
    <div className="flex w-full h-full overflow-auto">
      <Spreadsheet
        data={data}
        onChange={handleChange}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
        
      />
    </div>
  );
};

export const DossierSheet = memo(PureDossierSheet);
