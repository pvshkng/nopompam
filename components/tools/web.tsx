import React from "react";
import { cn } from "@/lib/utils";
import { Link, LoaderCircle, Globe } from "lucide-react";
import { MessageSkeleton } from "@/components/chat/message-area/message-loading-skeleton";
import { memo } from "react";

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

const PureWeb = (props: any) => {
  //tool.type =
  const { tool }: any = props;
  return (
    <>
      <div
        //defaultOpen={tool?.state == "output-available"}
        className="py-3 px-4 my-2 mx-2 border border-stone-300 rounded-md bg-neutral-100"
      >
        <div
          //disabled={tool?.state !== "output-available"}
          className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold [&[data-state=open]>svg]:rotate-180"
        >
          <span className="flex items-center gap-2">
            {tool?.state !== "output-available" ? (
              <LoaderCircle
                size={16}
                className="!animate-spin !opacity-100 text-stone-500"
              />
            ) : (
              <Globe
                size={16}
                className="shrink-0 text-stone-500"
                aria-hidden="true"
              />
            )}

            <span className="flex flex-row gap-2 items-center text-stone-500 text-xs truncate">
              {tool?.type?.replace("tool-", "").toUpperCase() || "TOOL"}
              {tool.input?.query! && (
                <>
                  <hr className="flex h-full w-px border border-stone-400" />
                  {tool.input?.query?.toUpperCase() || ""}
                </>
              )}
            </span>
          </span>
          {/* <ChevronDownIcon
            size={16}
            className="mt-1 shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          /> */}
        </div>

        {/* Content */}
        <>
          {(() => {
            switch (tool.state) {
              case "input-streaming":
              case "input-available":
                return <MessageSkeleton />;
              case "output-available":
                return (
                  <>
                    <div
                      className={cn(
                        "flex flex-col overflow-hidden transition-all w-full"
                      )}
                    >
                      {tool.output?.results &&
                        tool.output?.results?.map((item: any, i: number) => {
                          return (
                            <a
                              key={i}
                              className="text-xs mt-3"
                              href={item?.url!}
                            >
                              <span className="flex gap-1 mb-1 font-semibold items-center overflow-hidden underline">
                                {item.favicon ? (
                                  <img
                                    src={item.favicon}
                                    alt={""}
                                    width={12}
                                    height={12}
                                    loading="eager"
                                  />
                                ) : (
                                  <Link className="text-stone-500 size-3" />
                                )}

                                <span className="text-[10px] truncate">
                                  {item.title}
                                </span>
                              </span>
                              <span className="text-[10px] line-clamp-2 truncate">
                                {item.content}
                              </span>
                            </a>
                          );
                        })}
                    </div>
                  </>
                );
              default:
                return <></>;
            }
          })()}
        </>
      </div>
    </>
  );
};

export const Web = memo(PureWeb);
