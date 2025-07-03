"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { CloseIcon } from "@/components/icons/close";
import { CodeEditor } from "./canvas-code-editor";
import { Tiptap } from "@/components/tiptap/editor";

export function Canvas(props: any) {
  const { tabs, setTabs } = props;
  const [content, setContent] = useState(null);

  const t = {
    artifactId: "edPrBYrAH3rLdJAk",
    threadId: "iil8cNfsc8NLiqPMtCGlnlgy",
    user: "p.kungsapattarakul@gmail.com",
    kind: "text",
    title: "One paragraph Love story",
    content: `Their eyes met across the crowded bookstore, a silent spark igniting between Amelia, engrossed in a worn copy of "One Hundred Years of Solitude," and Leo, searching for a birthday gift for his sister. He was drawn to the way her brow furrowed in concentration, the gentle curve of her lips as she absorbed the words. She noticed the kindness in his eyes, the way he patiently helped an elderly woman reach a high shelf. A shared smile, a hesitant conversation about Gabriel Garcia Marquez, and suddenly, the world around them faded away. They spent hours lost in each other's company, discovering a shared love for literature, rainy days, and the comforting aroma of old books. That day in the bookstore marked the beginning of their own story, a love story penned not with ink, but with shared glances, whispered secrets, and the quiet understanding that they had found their home in each other's hearts.\n`,
    status: "active",
    isVisible: true,
    timestamp: "1750869055494",
  };

  return (
    <>
      {/* <section className={cn("flex flex-col gap-4", "size-full")}> */}
      <Tabs defaultValue="" className={cn("flex flex-col size-full")}>
        <TabsList
          className={cn(
            "flex w-full items-end justify-start gap-1",
            "!pb-0 !mb-0",
            "overflow-x-auto",
            "rounded-none",
            "bg-stone-300"
          )}
        >
          {tabs.map((t) => (
            <TabsTrigger
              key={t.artifactId}
              value={`${t.artifactId}`}
              className={cn(
                //"data-[state=active]:border-stone-400",
                //"data-[state=active]:border",
                "m-0",
                //"data-[state=active]:rounded-t-xl",
                //"data-[state=active]:rounded-b-none",
                "data-[state=active]:rounded-none",
                "data-[state=active]:bg-white",
                "data-[state=active]:shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
              )}
            >
              <div>{t.title}</div>

              <div
                className="ml-2 cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  setContent(t.content);
                  setTabs((prev) =>
                    prev.filter((item) => item.artifactId !== t.artifactId)
                  );
                }}
              >
                <CloseIcon />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t, i) => (
          <TabsContent
            key={i}
            value={`${t.artifactId}`}
            className="flex flex-col m-0 p-0 bg-white data-[state=active]:h-fit data-[state=active]:shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          >
            {/* {t.content} */}
            <Tiptap />
            {/* <CodeEditor /> */}
          </TabsContent>
        ))}
      </Tabs>
      {/* </section> */}
    </>
  );
}
