import { useEffect, useRef, useState } from "react";

export function useSpacer(threshold = 10) {
  const lastElementRef = useRef(null);
  const spacerRef = useRef(null);
  const [isBottom, setisBottom] = useState(false);

  const handleScroll = () => {
    if (lastElementRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = lastElementRef.current;
      const isAtTop = scrollTop == scrollHeight - clientHeight;
      setisBottom(isAtTop);
    }
  };

  const scrollToBottom = () => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollTop = lastElementRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const element = lastElementRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    spacerRef,
    lastElementRef,
    isBottom,
    scrollToBottom,
    handleScroll,
  };
}
