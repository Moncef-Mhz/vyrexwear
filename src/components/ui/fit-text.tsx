"use client";
import { useEffect, useRef } from "react";
// type Props = {
//   text: string;
// };

export const ScreenFitText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const resizeText = () => {
    const container = containerRef.current;
    const text = textRef.current;

    if (container && text) {
      const containerWidth = container.offsetWidth;
      let min = 1;
      let max = 2500;
      let lastValidSize = 1;

      while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        text.style.fontSize = `${mid}px`;

        if (text.offsetWidth <= containerWidth) {
          lastValidSize = mid;
          min = mid + 1;
        } else {
          max = mid - 1;
        }
      }

      text.style.fontSize = `${lastValidSize}px`;
    }
  };

  useEffect(() => {
    resizeText();

    const handleResize = () => resizeText();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="flex h-full w-full items-center justify-center overflow-hidden bg-background"
      ref={containerRef}
    >
      <span
        className="whitespace-nowrap text-center font-black select-none uppercase text-neutral-900 "
        ref={textRef}
      >
        VyrexWear
      </span>
    </div>
  );
};
