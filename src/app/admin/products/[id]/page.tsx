import { PageParamsProps } from "@/types";
import React from "react";

const Product = async ({ params }: PageParamsProps) => {
  const { id } = await params;

  if (id === "new") {
    return <div>New Product Page</div>;
  }

  const numericId = Number(id);
  if (!isNaN(numericId)) {
    return <div>product {id}</div>;
  }

  // Fallback
  return <div>Invalid category ID</div>;
};

export default Product;
