import { useEffect, useRef, useState } from "react";

export function useScrollToBottom(thresholdRatio = 0.1) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastUserElementRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement>>({});
  const spacerRef = useRef<HTMLDivElement | null>(null);

  const [isBottom, setIsBottom] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // --- measure distance from bottom ---
  const handleScroll = () => {
    if (!containerRef.current) {
      return;
    }
    const container = containerRef.current;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Distance from bottom in pixels
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // 20% of container height as threshold
    const threshold = clientHeight * 0.5;
    if (!containerRef.current || !lastUserElementRef.current) return;
    const lastRect = lastUserElementRef.current.getBoundingClientRect();
    // Check if within 20% from bottom
    const atBottom = lastRect.top <= 0;
    setIsBottom(atBottom);
    const shouldBounceBack = scrollHeight - scrollTop <= clientHeight;
    setAutoScrollEnabled(shouldBounceBack);
  };

  // --- smooth scroll to bottom ---
  const scrollToBottom = () => {
    const c = lastUserElementRef.current;
    if (!c) {
      return;
    }
    c.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  // --- dynamically adjust spacer ---
  const adjustSpacer = () => {
    if (!containerRef.current || !lastUserElementRef.current) return;
    const container = containerRef.current;
    const lastRect = lastUserElementRef.current.getBoundingClientRect();
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
    spacerRef,
    spacerHeight,
    isBottom,
    scrollToBottom,
    adjustSpacer,
    handleScroll,

    lastUserElementRef,
    messageRefs,
  };
}

export default useScrollToBottom;
