import { MonacoWithShiki } from "@/components/monaco/monaco-editor";
import Spreadsheet from "react-spreadsheet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function CodeEditor(props: any) {
  //generate blank data 99*99
  const generateBlankData = (rows: number, cols: number) => {
    const data = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ value: "" });
      }
      data.push(row);
    }
    return data;
  };
  const data = generateBlankData(10, 10);

  return (
    <>
      <ResizablePanelGroup
        direction="vertical"
        className="flex min-h-[50%] rounded-lg border m-3"
      >
        <ResizablePanel>
          <div className="flex flex-col size-full p-2 ">
            <MonacoWithShiki />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <div className="flex size-full items-start justify-start overflow-scroll p-0">
            <Spreadsheet data={data} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
