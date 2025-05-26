import { getProductbyId } from "@/app/actions/products";
import ProductPage from "@/components/product/product-page";
import React from "react";

type params = Promise<{ id: string }>;

const Product = async ({ params }: { params: params }) => {
  const { id } = await params;

  if (id === "new") {
    return <ProductPage />;
  }

  const numericId = Number(id);
  if (!isNaN(numericId)) {
    const product = await getProductbyId(numericId);
    if (!product || product.error) {
      return <div>Product not found</div>;
    }
    return (
      <ProductPage
        InitailProduct={product.product}
        InitialCategories={product.categoryRelations}
      />
    );
  }

  // Fallback
  return <div>Invalid category ID</div>;
};

export default Product;
