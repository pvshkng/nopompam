"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { CloseIcon } from "@/components/icons/close";
import { CodeEditor } from "./dossier-code-editor";
import { Tiptap } from "@/components/tiptap/editor";
import { ForwardRefEditor } from "@/components/editor";
import { memo } from "react";

function PureDossier(props: any) {
  const {
    dossierOpen,
    setDossierOpen,
    artifacts,
    setArtifacts,
    activeTab,
    setActiveTab,
  } = props;

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
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        hidden={!dossierOpen}
        defaultValue={
          (artifacts.length > 0 && artifacts[0].artifactId) || undefined
        }
        className={cn("flex flex-col size-full !max-h-[300px]")}
      >
        <TabsList
          className={cn(
            "flex w-full items-end justify-start gap-1",
            "!pb-0 !mb-0",
            "overflow-x-auto",
            "rounded-none",
            "bg-stone-300"
          )}
        >
          {artifacts.map((t: any) => (
            <TabsTrigger
              key={t.artifactId}
              value={`${t.artifactId}`}
              className={cn(
                //"data-[state=active]:border-stone-400",
                //"data-[state=active]:border",
                "mx-1",
                //"data-[state=active]:rounded-t-xl",
                //"data-[state=active]:rounded-b-none",
                "data-[state=active]:rounded-none",
                "data-[state=active]:bg-[#f0f0f2]",
                "data-[state=active]:shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
              )}
            >
              <div>{t.title}</div>

              {/* <div
                className="ml-2 cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  setActiveTab((prev: any) =>
                    prev.filter((item: any) => item.artifactId !== t.artifactId)
                  );
                }}
              >
                <CloseIcon />
              </div> */}
            </TabsTrigger>
          ))}
        </TabsList>

        {artifacts.map((t: any, i: any) => (
          <TabsContent
            key={i}
            value={`${t.artifactId}`}
            className="flex flex-col m-0 p-0 max-h-0 bg-stone-50 data-[state=active]:h-fit"
          >
            {/* {t.content} */}
            {/* <Tiptap /> */}
            <ForwardRefEditor
              markdown={t.content}
              autoFocus={true}
              //className=""
              contentEditableClassName="max-h-dvh overflow-scroll"
            />
            {/* <CodeEditor /> */}
          </TabsContent>
        ))}
      </Tabs>
      {/* </section> */}
    </>
  );
}

export const Dossier = memo(PureDossier);