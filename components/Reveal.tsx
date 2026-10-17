"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

/**
 * Marks its subtree data-inview="true" the first time it scrolls into view.
 * CSS does the animating (.reveal-up, .thread-path in globals.css). Without
 * JavaScript, <html data-motion> is never set and nothing starts hidden.
 */
export default function Reveal({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-inview={inView ? "true" : "false"} {...props}>
      {children}
    </div>
  );
}
