import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";
// import { CopyButton } from "./CodeBlockCopy";

export async function CodeBlock(props: any) {
  const html = await codeToHtml(props.children, {
    lang: props.lang,
    theme: "kanagawa-dragon",
    transformers: [
      {
        code(node) {
          node.children = node.children.map((line, index) => {
            if ("properties" in line) {
              line.properties["data-line"] = String(index + 1);
            }
            return line;
          });
        },
      },
    ],
  });
  return (
    <>
      <div
        className={cn(
          "flex flex-col mx-auto size-full max-w-[90%] max-sm:max-w-full px-2 mb-2",
          "[&_div]:border-2",
          "[&_div]:border-zinc-800",
        )}
      >
        <div
          className={cn(
            //"rounded-t-xl",
            "bg-zinc-900",
            "p-2 px-3",
            "font-black !text-zinc-200",
            "justify-between flex items-center",
          )}
        >
          {props.lang}
          copy
          {/* <CopyButton code={props.children} /> */}
        </div>
        <div
          className={cn(
            //"rounded-b-xl",
            "!border-t-0",

            //Code Span
            "[&_pre]:py-2",
            "[&_pre]:overflow-x-auto",
            //"[&_pre]:rounded-b-xl",
            "[&_pre]:text-sm",
            "[&_pre]:!bg-zinc-900",
            "[&_pre]:max-width-full",

            // Line number styling
            "[&_pre]:relative",
            "[&_pre_code_.line]:pl-12",
            "[&_pre_.line]:relative",
            "[&_pre_.line]:before:content-[attr(data-line)]",
            "[&_pre_.line]:before:absolute",
            "[&_pre_.line]:before:left-0",
            "[&_pre_.line]:before:text-zinc-400",
            "[&_pre_.line]:before:w-8",
            "[&_pre_.line]:before:text-right",
            "[&_pre_.line]:before:mr-4",
            "[&_pre_.line]:before:select-none",
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
}