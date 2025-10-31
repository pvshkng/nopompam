import { useEffect, useRef, useState } from "react";

export function useScrollToBottom(thresholdRatio = 0.02) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  const [isBottom, setIsBottom] = useState(true);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // --- measure distance from bottom ---
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const threshold = container.clientHeight * thresholdRatio;
    const nearBottom = distanceFromBottom < threshold;
    const check =
      container.scrollHeight - container.scrollTop <= container.clientHeight;
    setIsBottom(check);
    setAutoScrollEnabled(nearBottom);
  };

  // --- smooth scroll to bottom ---
  const scrollToBottom = () => {
    const c = containerRef.current;
    if (!c) return;
    c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
  };

  // --- dynamically adjust spacer ---
  const adjustSpacer = () => {
    if (!containerRef.current || !lastElementRef.current) return;
    const container = containerRef.current;
    const lastRect = lastElementRef.current.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const gap = containerRect.bottom - lastRect.bottom - 12;
    setSpacerHeight(Math.max(0, gap));
  };

  // --- auto adjust on resize / scroll / message stream ---
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", adjustSpacer);

    return () => {
      c.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", adjustSpacer);
    };
  }, []);

  useEffect(() => {
    if (autoScrollEnabled) scrollToBottom();
  }, [autoScrollEnabled]);

  return {
    containerRef,
    wrapperRef,
    lastElementRef,
    spacerRef,
    spacerHeight,
    isBottom,
    scrollToBottom,
    adjustSpacer,
    handleScroll,
  };
}

export default useScrollToBottom;
