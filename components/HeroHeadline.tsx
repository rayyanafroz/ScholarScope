"use client";

import BlurText from "@/components/reactbits/BlurText";
import { useIntroDone } from "@/lib/useIntroDone";

/** The hero <h1>: React Bits BlurText, held until the intro curtain lifts. */
export default function HeroHeadline() {
  const introDone = useIntroDone();

  return (
    <BlurText
      as="h1"
      text="Every paper is part of a larger conversation."
      highlight={["conversation."]}
      highlightClassName="italic text-accent"
      start={introDone}
      delay={70}
      stepDuration={0.45}
      blur={10}
      distance={22}
      className="font-serif text-[2.45rem] font-medium leading-[1.04] tracking-tight text-ink sm:text-[4.25rem] lg:text-[4.75rem]"
    />
  );
}
