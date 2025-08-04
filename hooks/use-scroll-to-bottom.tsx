import { useEffect, useRef, useState } from "react";

export function useScrollToBottom(threshold = 10) {
  const containerRef = useRef(null);
  const [isBottom, setisBottom] = useState(false);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtTop = scrollTop >= 0;
      setisBottom(isAtTop);
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    containerRef,
    isBottom,
    scrollToBottom,
    handleScroll,
  };
}
