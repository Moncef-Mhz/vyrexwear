import { categoryList } from "@/constant";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCategories = () => {
  return (
    <div className="grid  gap-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {categoryList.map((cat) => (
        <Link
          href={cat.link}
          key={cat.id}
          className="w-full h-[550px] lg:h-[450px] group relative overflow-hidden"
        >
          <Image
            src={cat.images}
            alt={cat.title}
            fill
            className="group-hover:scale-105 duration-200"
          />
          <h1 className="text-2xl z-10 uppercase font-bold text-white absolute bottom-0 left-0 p-10">
            {cat.title}
          </h1>
          <div className="w-full h-full absolute inset-0 bg-black/20" />
        </Link>
      ))}
    </div>
  );
};

export default ProductCategories;
