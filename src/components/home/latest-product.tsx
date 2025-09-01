import { getLatestProducts } from "@/app/actions/products";
import { SelectProduct } from "@/db/schema/product";
import React, { useEffect, useState } from "react";
import ProductCard from "../shop/product-card";
import Link from "next/link";

const LatestProduct = () => {
  const [products, setProducts] = useState<SelectProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getLatestProducts();

        if (res && Array.isArray(res.products)) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("error occured", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold capitalize">New Arrival</h1>
        <Link href={"/shop"} className="text-xs underline">
          See All
        </Link>
      </div>
      {displayItems(products)}
    </div>
  );
};

export default LatestProduct;

export const displayItems = (products: SelectProduct[]) => {
  return (
    <div className="grid md:gap-2 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
      {products.map((product, index) => (
        <ProductCard product={product} key={index} />
      ))}
    </div>
  );
};
