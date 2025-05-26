"use client";

import { SelectProduct } from "@/db/schema/product";
import { useEffect, useState } from "react";
import { getProducts } from "../actions/products";
import ProductCard from "@/components/shop/product-card";

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
    <div className="p-6  min-h-screen">
      <div className="grid gap-10 grid-cols-4">
        {products.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </div>
  );
};
export default ShopPage;
