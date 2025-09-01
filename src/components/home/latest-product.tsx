import { getLatestProducts } from "@/app/actions/products";
import { SelectProduct } from "@/db/schema/product";
import React, { useEffect, useState } from "react";

const LatestProduct = () => {
  const [products, setProducts] = useState<SelectProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getLatestProducts();

        if (res) {
          setProducts(res.products);
        }
      } catch (error) {
        console.log("error occured", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>New Arrival</h1>
    </div>
  );
};

export default LatestProduct;
