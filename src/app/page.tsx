"use client";

import { Gutter } from "@/components/global/Gutter";
import Hero from "@/components/home/hero";
import LatestProduct from "@/components/home/latest-product";
import ProductCategories from "@/components/home/product-categories";

export default function Home() {
  return (
    <main className="w-full space-y-8 md:space-y-0">
      <Gutter className="space-y-8 md:space-y-14">
        <Hero />
        <LatestProduct />
      </Gutter>
      <div className="space-y-0">
        <ProductCategories />
      </div>
    </main>
  );
}
