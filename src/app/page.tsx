"use client";

import { Gutter } from "@/components/global/Gutter";
import Hero from "@/components/home/hero";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full">
      <Gutter>
        <Hero />
      </Gutter>
    </main>
  );
}
