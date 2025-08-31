"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full">
      <div className=" relative w-full lg:h-[calc(100vh-10vh)] overflow-hidden">
        <Image
          src={"/assets/hero.jpg"}
          alt="hero"
          width={800}
          height={1200}
          className="w-full h-full object-cover"
        />
        <div className="absolute left-0 bottom-0 p-20 text-white font-bold text-4xl">
          <h1 className="uppercase">New Collection Out</h1>
          <Button className="rounded-none" size={"lg"}>
            Shop Now
          </Button>
        </div>
      </div>
    </main>
  );
}
