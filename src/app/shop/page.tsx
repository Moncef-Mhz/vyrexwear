"use client";

import { SelectProduct } from "@/db/schema/product";
import { useEffect, useState } from "react";
import { getProducts } from "../actions/products";
import { Gutter } from "@/components/global/Gutter";
import { displayItems } from "@/components/home/latest-product";

const ShopPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<SelectProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        if (res.error) {
          console.error("Error fetching products:", res.error);
        } else if (res.products) {
          setProducts(res.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Gutter className="py-6 min-h-screen">{displayItems(products)}</Gutter>
  );
};
export default ShopPage;
