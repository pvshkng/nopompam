import { useEffect, useRef, useState } from "react";

export function useSpacer(threshold = 10) {
  const lastUserElementRef = useRef(null);
  const spacerRef = useRef(null);
  const [isBottom, setisBottom] = useState(false);

  const handleScroll = () => {
    if (lastUserElementRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = lastUserElementRef.current;
      const isAtTop = scrollTop == scrollHeight - clientHeight;
      setisBottom(isAtTop);
    }
  };

  const scrollToBottom = () => {
    if (lastUserElementRef.current) {
      lastUserElementRef.current.scrollTop = lastUserElementRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const element = lastUserElementRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    spacerRef,
    lastUserElementRef,
    isBottom,
    scrollToBottom,
    handleScroll,
  };
}
