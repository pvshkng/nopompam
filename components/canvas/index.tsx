"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { CloseIcon } from "@/components/icons/close";
import { CodeEditor } from "./canvas-code-editor";

export function Canvas(props: any) {
  const [tabs, setTabs] = useState([
    { id: "1", toolName: "sql", type: "sql" },
    { id: "2", toolName: "sql", type: "sql" },
  ]);

  return (
    <>
      {/* <section className={cn("flex flex-col gap-4", "size-full")}> */}
      <Tabs defaultValue="" className={cn("flex flex-col size-full ")}>
        <TabsList
          className={cn(
            "flex w-full items-end justify-start gap-1",
            "!pb-0 !mb-0",
            "overflow-x-auto",
            "rounded-none",
            "bg-gradient-to-br from-stone-100 to-stone-300"
          )}
        >
          {tabs.map((w) => (
            <TabsTrigger
              key={w.id}
              value={`${w.toolName}-${w.id}`}
              className={cn(
                //"data-[state=active]:border-stone-400",
                //"data-[state=active]:border",
                "m-0",
                "data-[state=active]:rounded-t-xl",
                "data-[state=active]:rounded-b-none",
                "data-[state=active]:bg-white",
                "data-[state=active]:shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
              )}
            >
              <div>{w.toolName.toLocaleUpperCase()}</div>

              <div
                className="ml-2 cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  setTabs((prev) => prev.filter((item) => item.id !== w.id));
                }}
              >
                <CloseIcon />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((w, i) => (
          <TabsContent
            key={i}
            value={`${w.toolName}-${w.id}`}
            className="flex m-0 p-0 bg-white data-[state=active]:h-[100%] data-[state=active]:shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          >
            <CodeEditor />
          </TabsContent>
        ))}
      </Tabs>
      {/* </section> */}
    </>
  );
}
