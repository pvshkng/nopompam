/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarousel from "./Carousel/EmblaCarousel";

type TemplateSelectorProps = {
  name: string;
  templates?: any[];
};

export default function TemplateSelector(props: TemplateSelectorProps) {
  const { name, templates = [] } = props;
  const initialRender = useRef(true);
  const OPTIONS: EmblaOptionsType = { align: 'start', dragFree: true, loop: true }

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto py-7">

      <div className="template-area-header font-semibold px-2">
        <div className="text-2xl text-green-600">Hello, {name}</div>
        <div className="text-2xl text-gray-500">How can I help you today?</div>
      </div>

      <div className="flex flex-col my-auto h-full m-2">
        <div className="text-gray-500 ">
          You can select templates as following below or ask me anything!
        </div>
        {templates.length > 0 ? (
          <>
            <div className="w-full h-full">
              <EmblaCarousel slides={templates} options={OPTIONS} />
            </div>
          </>
        ) : (
          <div className="text-gray-500 p-2">No templates available</div>
        )}
      </div>
    </div>
  );
}
