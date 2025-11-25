import { JSX, useLayoutEffect, useState, useMemo, memo } from "react";
import { BundledLanguage } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki/bundle/web";
import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { BarChartHorizontal } from "@/components/charts/bar-chart-horizontal";
import { TLDR } from "./tldr";
import { FollowUp } from "./follow-up";
import { Stock } from "./stock";
import { Link } from "lucide-react";

export const components: Partial<any> = {
  // @ts-ignore
  p: ({ children }) => {
    if (
      children &&
      typeof children === "object" &&
      children.type &&
      ["tldr", "chart"].includes(children.type)
    ) {
      return children;
    }
    return <p>{children}</p>;
  },
  a: ({
    children,
    className,
    href,
    ...props
  }: {
    children: React.ReactNode;
    className: React.HTMLAttributes<any>;
    href: any;
  }) => (
    <>
      <a
        href={href}
        {...props}
        className={cn(
          "items-center underline text-semibold text-sm text-stone-500 gap-1"
        )}
      >
        <img
          onError={(e) => {
            // @ts-ignore
            // e.target.style.display = "none";
            // @ts-ignore
            // e.target.nextElementSibling.style.display = "inline";
            e.target.src = "/icon/link.svg";
          }}
          src={`https://www.google.com/s2/favicons?domain=${
            new URL(href).hostname
          }&sz=16`}
          className="inline max-h-3 max-w-3 mr-1"
        />
        {children}
      </a>
    </>
  ),

  // @ts-ignore
  img: ({ children, className, src, alt, ...props }) => (
    <img
      src={src}
      alt={alt}
      {...props}
      className={cn("max-h-64 my-2 mr-auto rounded-md border border-stone-300")}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/image/placeholder-image.jpg";
      }}
    />
  ),

  chart: () => {
    return <BarChartHorizontal />;
  },
  stock: ({ symbol }: { symbol: string }) => {
    return (
      <span className="flex flex-col size-full">
        <Stock symbol={symbol} />
      </span>
    );
  },
  tldr: ({ children }: { children: React.ReactNode }) => {
    return <TLDR>{children}</TLDR>;
  },
  followup: ({ children }: { children: React.ReactNode }) => {
    return <FollowUp>{children}</FollowUp>;
  },
  think: ({ children }: { children: React.ReactNode }) => {
    return <p>{children}</p>;
  },
  pre: ({
    children,
    className,
    ...props
  }: {
    children: any;
    className?: string;
  }) => {
    let code = "";
    let language: BundledLanguage | any = "";
    if (children && children.props) {
      const match = /language-(\w+)/.exec(children.props.className || "");
      if (match) {
        const detectedLanguage = match[1];
        language = isBundledLanguage(detectedLanguage) ? detectedLanguage : "";
      }

      code = children.props.children || "";
    }

    return <HighlightedCodeBlock language={language} code={code} />;
  },

  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => (
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

    useLayoutEffect(() => {
      let isMounted = true;

      const highlightCode = async () => {
        try {
          const generatedHtml = await codeToHtml(code, {
            lang: language,
            theme: "min-light",
            transformers: [
              {
                code(node) {
                  let lineNumber = 1;
                  node.children = node.children.map((line) => {
                    if ("properties" in line) {
                      line.properties["data-line"] = String(lineNumber++);
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
    }, [code, language]);

    return (
      <div
        className={cn(
          "!opacity-100",
          "!animate-none",
          "[&_*]:!opacity-100",
          "[&_*]:!animate-none",
          "flex flex-col mx-auto size-full mb-4",
          "!text-white"
        )}
      >
        <div
          className={cn(
            "bg-stone-300",
            "px-3",
            "font-black !text-stone-500",
            "justify-between flex items-center"
          )}
        >
          {language}
          <button>
            <Copy width={16} height={16} className="my-1" />
          </button>
        </div>
        <div
          className={cn(
            "!border-t-0",
            "[&_pre]:p-2",
            "[&_pre]:overflow-x-auto",
            "[&_pre]:text-sm",
            "[&_pre]:!bg-stone-100",
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

HighlightedCodeBlock.displayName = "HighlightedCodeBlock";
