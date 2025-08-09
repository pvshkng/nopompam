import { cn } from "@/lib/utils";
import { BookCheckIcon, LoaderCircle } from "lucide-react";
import {
  useEffect,
  useState,
  memo,
  ReactNode,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { useDossierStore } from "@/lib/stores/dossier-store";

const reconstructMarkdownFromChildren = (children: ReactNode): string => {
  const reconstructNode = (node: ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    
    if (Array.isArray(node)) {
      return node.map(child => reconstructNode(child)).join('');
    }
    
    if (node && typeof node === 'object' && 'props' in node) {
      const element = node as any;
      
      // Quick type check for performance
      const type = element.type;
      const props = element.props;
      
      if (!props) return '';
      
      switch (type) {
        case 'p':
          return reconstructNode(props.children) + '\n\n';
        case 'strong':
          return `**${reconstructNode(props.children)}**`;
        case 'em':
          return `*${reconstructNode(props.children)}*`;
        case 'code':
          return `\`${reconstructNode(props.children)}\``;
        case 'pre':
          return `\`\`\`\n${reconstructNode(props.children)}\n\`\`\`\n\n`;
        case 'h1':
          const h1Text = reconstructNode(props.children);
          return `# ${h1Text}\n\n`;
        case 'h2':
          const h2Text = reconstructNode(props.children);
          return `## ${h2Text}\n\n`;
        case 'h3':
          const h3Text = reconstructNode(props.children);
          return `### ${h3Text}\n\n`;
        case 'ul':
          return reconstructNode(props.children);
        case 'li':
          return `- ${reconstructNode(props.children)}\n`;
        case 'ol':
          return reconstructNode(props.children);
        case 'blockquote':
          const blockText = reconstructNode(props.children);
          return `> ${blockText}\n\n`;
        case 'a':
          const linkText = reconstructNode(props.children);
          const href = props.href || '#';
          return `[${linkText}](${href})`;
        case 'img':
          const alt = props.alt || '';
          const src = props.src || '';
          return `![${alt}](${src})`;
        default:
          // Handle node-based elements (when ReactMarkdown passes node info)
          if (props.node?.tagName) {
            const tagName = props.node.tagName;
            switch (tagName) {
              case 'strong':
                return `**${reconstructNode(props.children)}**`;
              case 'em':
                return `*${reconstructNode(props.children)}*`;
              case 'code':
                return `\`${reconstructNode(props.children)}\``;
              case 'h1':
                const text = reconstructNode(props.children);
                return `${text}\n${'='.repeat(Math.min(text.length, 50))}\n\n`;
              case 'h2':
                const h2NodeText = reconstructNode(props.children);
                return `${h2NodeText}\n${'-'.repeat(Math.min(h2NodeText.length, 50))}\n\n`;
              default:
                return reconstructNode(props.children);
            }
          }
          // Generic fallback
          return reconstructNode(props.children);
      }
    }
    
    return '';
  };

  return reconstructNode(children);
};

const PureDocument = ({ children }: { children: React.ReactNode }) => {
  const { 
    openDossier, 
    setStreamingContent, 
    setIsStreaming, 
  } = useDossierStore();
  
  const [isLocalStreaming, setLocalStreaming] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastContentRef = useRef<string>('');
  //const processingRef = useRef<boolean>(false);

  // Memoize the reconstruction to avoid recalculating on every render
  const reconstructedMarkdown = useMemo(() => {
    return reconstructMarkdownFromChildren(children);
  }, [children]);

const debouncedUpdate = useCallback((content: string) => {
  if (content !== lastContentRef.current && content.trim().length > 0) {
    // Open dossier only once
    const store = useDossierStore.getState();
    if (!store.dossierOpen) {
      openDossier('documents');
      setIsStreaming(true);
    }
    
    // Clean up the content
    const cleanContent = content
      .replace(/\\r\\n/g, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    setStreamingContent(cleanContent);
    lastContentRef.current = cleanContent;
  }
}, [openDossier, setStreamingContent, setIsStreaming]);

  // Handle streaming end
  const handleStreamingEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsStreaming(false);
      setLocalStreaming(false);
    }, 200);
  }, [setIsStreaming]);

 useEffect(() => {
  if (reconstructedMarkdown.trim().length > 0) {
    debouncedUpdate(reconstructedMarkdown);
    
    // Simple timeout for ending stream
    const timeoutId = setTimeout(() => {
      setIsStreaming(false);
      setLocalStreaming(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }
}, [reconstructedMarkdown, debouncedUpdate]);

  return (
    <span
      className={cn(
        "flex flex-col w-full px-4 py-3 gap-2 my-2",
        "border border-stone-300 rounded-md bg-neutral-100"
      )}
    >
      <span className="text-xs flex flex-row text-stone-500 items-center gap-2">
        {isLocalStreaming ? (
          <LoaderCircle size={16} className="!animate-spin !opacity-100" />
        ) : (
          <BookCheckIcon size={16} />
        )}
        Document
      </span>
    </span>
  );
};

export const Document = memo(PureDocument);
