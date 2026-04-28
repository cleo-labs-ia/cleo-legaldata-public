"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export default function AnimatedNumber({ value, duration = 1800, format, className }: Props) {
  const [display, setDisplay] = useState(0);
  const startedAt = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    function step(ts: number) {
      if (startedAt.current === null) startedAt.current = ts;
      const elapsed = ts - startedAt.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) {
        rafId.current = requestAnimationFrame(step);
      }
    }
    startedAt.current = null;
    rafId.current = requestAnimationFrame(step);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration]);

  const text = format ? format(display) : display.toLocaleString();
  return <span className={className}>{text}</span>;
}
