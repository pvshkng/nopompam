import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDossierStore } from "@/lib/stores/dossier-store";
import Spreadsheet from "react-spreadsheet";

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
  const previousContentRef = useRef<string>("");

  useEffect(() => {
    if (content && content !== previousContentRef.current) {
      try {
        const parsedData = JSON.parse(content);

        if (Array.isArray(parsedData)) {
          const formattedData = parsedData.map((row) =>
            Array.isArray(row) ? row.map((cell) => ({ value: cell })) : []
          );
          setData(formattedData);
        } else {
          console.warn("Parsed content is not an array, using empty array");
          setData([]);
        }
      } catch (error) {
        console.warn("Failed to parse content as JSON:", error);
        setData([]);
      }

      previousContentRef.current = content;
    }
  }, [content]);

  const handleChange = (newData: any[][]) => {
    if (!readOnly) {
      const rawData = newData.map((row) =>
        row.map((cell) => cell?.value ?? "")
      );
      handleContentChange(JSON.stringify(rawData));
    }
  };

  return (
    <>
      <Spreadsheet
        data={data}
        onChange={setData}
        columnLabels={[]}
        rowLabels={[]}
      />
    </>
  );
};

export const DossierSheet = memo(PureDossierSheet);
