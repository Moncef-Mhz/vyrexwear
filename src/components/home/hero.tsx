import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div>
      <div className="relative w-full rounded-lg h-[calc(100vh-15vh)] lg:h-[calc(100vh-10vh)] overflow-hidden">
        <Image
          src={"/assets/hero.jpg"}
          alt="hero"
          width={800}
          height={1200}
          className="w-full h-full object-cover"
        />
        <div className="absolute left-0 z-10 space-y-4 bottom-0 p-4 sm:p-6 md:p-10 lg:p-16 2xl:p-20 text-white">
          <div className="space-y-1">
            <h1 className="uppercase  text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold ">
              Vyrex Summer ‘25 Collection
            </h1>
            <p className="text-white/70 text-sm md:text-base ">
              Minimal. Timeless. Made for every day.
            </p>
          </div>
          <Button className="rounded-none" size={"lg"}>
            Shop Now
          </Button>
        </div>
        <div className="w-full h-full inset-0 bg-black/30 absolute" />
      </div>
    </div>
  );
};

export default Hero;
