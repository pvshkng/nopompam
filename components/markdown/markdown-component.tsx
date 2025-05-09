import { JSX, useLayoutEffect, useState, useMemo, memo } from "react";
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

const HighlightedCodeBlock = memo(
  ({ code, language }: { code: string; language: BundledLanguage }) => {
    const [html, setHtml] = useState<string>("");

    // Memoize the className concatenation
    const containerClassName = useMemo(
      () =>
        cn(
          "flex flex-col mx-auto size-full",
          "[&_div]:border",
          "[&_div]:border-stone-800",
          "!text-white"
        ),
      []
    );

    const codeContainerClassName = useMemo(
      () =>
        cn(
          "rounded-b-md",
          "!border-t-0",
          "[&_pre]:p-2",
          "[&_pre]:overflow-x-auto",
          "[&_pre]:text-sm",
          "[&_pre]:!bg-stone-600",
          "[&_pre]:max-width-full",
          "[&_pre]:relative",
          "[&_pre_code_.line]:pl-8",
          "[&_pre_.line]:relative",
          "[&_pre_.line]:before:content-[attr(data-line)]",
          "[&_pre_.line]:before:absolute",
          "[&_pre_.line]:before:left-0",
          "[&_pre_.line]:before:text-zinc-400",
          "[&_pre_.line]:before:w-4",
          "[&_pre_.line]:before:text-right",
          "[&_pre_.line]:before:select-none"
        ),
      []
    );

    useLayoutEffect(() => {
      let isMounted = true;

      const highlightCode = async () => {
        try {
          const generatedHtml = await codeToHtml(code, {
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
          });

          if (isMounted) {
            setHtml(generatedHtml);
          }
        } catch (error) {
          console.error("Error highlighting code:", error);
        }
      };

      highlightCode();

      return () => {
        isMounted = false;
      };
    }, [code, language]); // Only re-run when code or language changes

    return (
      <div
        className={cn(
          "!opacity-100",
          "!animate-none",
          "[&_*]:!opacity-100",
          "[&_*]:!animate-none",
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
        </div>
        <div
          className={cn(
            "rounded-b-md",
            "!border-t-0",
            "[&_pre]:p-2",
            "[&_pre]:overflow-x-auto",
            "[&_pre]:text-sm",
            "[&_pre]:!bg-stone-800",
            "[&_pre]:max-width-full",
            "[&_pre]:relative",
            "[&_pre_code_.line]:pl-8",
            "[&_pre_.line]:relative",
            "[&_pre_.line]:before:content-[attr(data-line)]",
            "[&_pre_.line]:before:absolute",
            "[&_pre_.line]:before:left-0",
            "[&_pre_.line]:before:text-zinc-400",
            "[&_pre_.line]:before:w-4",
            "[&_pre_.line]:before:text-right",
            "[&_pre_.line]:before:select-none"
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }
);

// Add display name for debugging
HighlightedCodeBlock.displayName = "HighlightedCodeBlock";
