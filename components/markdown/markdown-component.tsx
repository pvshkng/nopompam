import { JSX, useLayoutEffect, useState } from "react";
import { BundledLanguage } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki/bundle/web";
import { codeToHtml } from "shiki";
// import { CodeBlock } from "./code-container";
import { cn } from "@/lib/utils";

export const components: Partial<any> = {
  pre: ({ children, className, ...props }) => {
    let code = "";
    let language: string = "md";

    if (children && children.props) {
      const match = /language-(\w+)/.exec(children.props.className || "");
      if (match) {
        const detectedLanguage = match[1];
        language = isBundledLanguage(detectedLanguage)
          ? detectedLanguage
          : "text";
      }

      // custom tag

      // else if (match && match[1] === "chart") {
      //   return {
      //     /* <ToolChart data={children} />; */
      //   };
      // }

      code = children.props.children || "";
    }

    return <HighlightedCodeBlock language={language} code={code} />;
  },

  code: ({ className, children, ...props }) => (
    <code className={className} {...props}>
      {children}
    </code>
  ),
};

export async function highlight(code: string, lang: BundledLanguage) {
  const out = await codeToHast(code, {
    lang,
    theme: "github-dark",
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element;
}

function isBundledLanguage(lang: string): lang is BundledLanguage {
  const bundledLanguages: string[] = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "md",
    "css",
    "html",
    "json",
    "python",
    "sql",
  ];
  return bundledLanguages.includes(lang);
}

function HighlightedCodeBlock({
  code,
  language,
}: {
  code: string;
  language: BundledLanguage;
}) {
  const [nodes, setNodes] = useState<JSX.Element | null>(null);
  const [html, setHtml] = useState<string>("");

  useLayoutEffect(() => {
    let isMounted = true;

    codeToHtml(code, {
      lang: language,
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
    }).then((generatedHtml) => {
      if (isMounted) {
        setHtml(generatedHtml);
      }
    });

    // highlight(code, language).then((highlightedCode) => {
    //   if (isMounted) {
    //     setNodes(highlightedCode);
    //   }
    // });
    // .catch((error) => {
    //   console.error("Error highlighting code:", error);
    //   if (isMounted) {
    //     setNodes(
    //       <pre>
    //         <code className={`language-${language}`}>{code}</code>
    //       </pre>
    //     );
    //   }
    // });

    return () => {
      isMounted = false;
    };
  }, [code, language]);

  return (
    //nodes ?? (
    <>
      <div
        className={cn(
          //max-w-[90%] max-sm:max-w-full px-2
          "flex flex-col mx-auto size-full",
          "[&_div]:border",
          "[&_div]:border-stone-800",
          "!text-white"
        )}
      >
        <div
          className={cn(
            "bg-stone-900",
            "p-2 px-3 rounded-t-md",
            "font-black !text-zinc-200",
            "justify-between flex items-center"
          )}
        >
          {language}
          copy
          {/* <CopyButton code={props.children} /> */}
        </div>
        <div
          className={cn(
            "rounded-b-md",
            "!border-t-0",

            //Code Span
            "[&_pre]:p-2",
            "[&_pre]:overflow-x-auto",
            //"[&_pre]:rounded-b-md",
            "[&_pre]:text-sm",
            "[&_pre]:!bg-stone-600",
            "[&_pre]:max-width-full",

            // Line number styling
            "[&_pre]:relative",
            "[&_pre_code_.line]:pl-8",
            "[&_pre_.line]:relative",
            "[&_pre_.line]:before:content-[attr(data-line)]",
            "[&_pre_.line]:before:absolute",
            "[&_pre_.line]:before:left-0",
            "[&_pre_.line]:before:text-zinc-400",
            "[&_pre_.line]:before:w-4",
            "[&_pre_.line]:before:text-right",
            //"[&_pre_.line]:before:mr-4",
            "[&_pre_.line]:before:select-none"
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        >
          {/* <pre> */}
          {/*   <code className={`language-${language}`}>{code}</code> */}
          {/* </pre> */}
        </div>
      </div>
    </>
    /*     <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre> */
  );
  //);
}
