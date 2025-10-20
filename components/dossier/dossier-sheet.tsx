import { memo, useEffect, useMemo, useState } from "react";
import DataGrid, { textEditor, type Column } from "react-data-grid";
import { parse, unparse } from "papaparse";
import "react-data-grid/lib/styles.css";
import { cn } from "@/lib/utils";

interface Row {
  id: number;
  rowNumber: number;
  [key: string]: string | number;
}

const MIN_ROWS = 50;
const MIN_COLS = 26;

const PureDossierSheet = ({
  content,
  handleContentChange,
  readOnly,
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
  const parseData = useMemo(() => {
    if (!content) {
      return new Array(MIN_ROWS).fill(new Array(MIN_COLS).fill(""));
    }

    const result = parse<string[]>(content, { skipEmptyLines: true });

    const paddedData = result.data.map((row) => {
      const paddedRow = [...row];
      while (paddedRow.length < MIN_COLS) {
        paddedRow.push("");
      }
      return paddedRow;
    });

    while (paddedData.length < MIN_ROWS) {
      paddedData.push(new Array(MIN_COLS).fill(""));
    }

    return paddedData;
  }, [content]);

  const columns = useMemo(() => {
    const rowNumberColumn: Column<Row> = {
      key: "rowNumber",
      name: "",
      frozen: true,
      width: 50,
      renderCell: ({ rowIdx }: any) => rowIdx + 1,
      cellClass:
        "border-t border-r bg-gray-50 dark:bg-zinc-950 dark:text-zinc-50",
      headerCellClass:
        "border-t border-r bg-gray-100 dark:bg-zinc-900 dark:text-zinc-50",
    };

    const dataColumns: Column<Row>[] = Array.from(
      { length: MIN_COLS },
      (_, i) => ({
        key: i.toString(),
        name: String.fromCharCode(65 + i),
        renderEditCell: !readOnly ? textEditor : undefined,
        width: 120,
        cellClass: cn("border-t dark:bg-zinc-950 dark:text-zinc-50", {
          "border-l": i !== 0,
        }),
        headerCellClass: cn("border-t dark:bg-zinc-900 dark:text-zinc-50", {
          "border-l": i !== 0,
        }),
      })
    );

    return [rowNumberColumn, ...dataColumns];
  }, [readOnly]);

  const initialRows = useMemo(() => {
    return parseData.map((row, rowIndex) => {
      const rowData: Row = {
        id: rowIndex,
        rowNumber: rowIndex + 1,
      };
      columns.slice(1).forEach((col, colIndex) => {
        rowData[col.key] = row[colIndex] || "";
      });
      return rowData;
    });
  }, [parseData, columns]);

  const [localRows, setLocalRows] = useState(initialRows);

  useEffect(() => {
    setLocalRows(initialRows);
  }, [initialRows]);

  const generateCsv = (data: string[][]) => {
    return unparse(data);
  };

  const handleRowsChange = (newRows: Row[]) => {
    if (readOnly) return;

    setLocalRows(newRows);

    const updatedData = newRows.map((row) => {
      return columns.slice(1).map((col) => (row[col.key] as string) || "");
    });

    const newCsvContent = generateCsv(updatedData);
    handleContentChange(newCsvContent);
  };

  return (
    <div className="w-full h-full">
      <DataGrid
        className="rdg-light"
        columns={columns}
        rows={localRows}
        onRowsChange={handleRowsChange}
        defaultColumnOptions={{
          resizable: true,
          sortable: !readOnly,
        }}
        enableVirtualization
        onCellClick={(args) => {
          if (!readOnly && args.column.key !== "rowNumber") {
            args.selectCell(true);
          }
        }}
        style={
          {
            height: "100%",
            width: "100%",
            "--rdg-color": "#000",
            "--rdg-border-color": "#e5e7eb",
            "--rdg-summary-border-color": "#aaa",
            "--rdg-background-color": "#fff",
            "--rdg-header-background-color": "#f9fafb",
            "--rdg-row-hover-background-color": "#f3f4f6",
            "--rdg-row-selected-background-color": "#dbeafe",
            "--rdg-row-selected-hover-background-color": "#bfdbfe",
            "--rdg-checkbox-focus-color": "#3b82f6",
            "--rdg-checkbox-disabled-border-color": "#ccc",
            "--rdg-checkbox-disabled-background-color": "#ddd",
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export const DossierSheet = memo(PureDossierSheet);
