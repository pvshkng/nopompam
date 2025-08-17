import { marked } from "marked";
import { memo, useMemo } from "react";
import { components } from "@/components/markdown/markdown-component";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({
    content,
    className,
    remarkPlugins,
    rehypePlugins,
    components,
    ...props
  }: {
    content: string;
    className?: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: any;
    [key: string]: any;
  }) => {
    return (
      <ReactMarkdown 
        className={className}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
        {...props}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.content === nextProps.content &&
      prevProps.className === nextProps.className &&
      prevProps.remarkPlugins === nextProps.remarkPlugins &&
      prevProps.rehypePlugins === nextProps.rehypePlugins &&
      prevProps.components === nextProps.components
    );
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({
    role,
    content,
    id,
    className,
    ...props
  }: {
    role: string;
    content: string;
    id: string;
    className?: string;
    [key: string]: any;
  }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);
    
    const markdownOptions = useMemo(
      () => ({
        remarkPlugins: role === "user" ? [] : [remarkGfm],
        rehypePlugins: role === "user" ? [] : [rehypeRaw],
        components: role === "user" ? {} : components,
      }),
      [role]
    );

    return (
      <>
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlock
            key={`${id}-block-${index}`}
            content={block}
            className={className}
            {...markdownOptions}
            {...props}
          />
        ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.content === nextProps.content &&
      prevProps.role === nextProps.role &&
      prevProps.id === nextProps.id
    );
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";