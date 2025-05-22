import {
  InsertProductSchema,
  NewProduct,
  SelectProduct,
} from "@/db/schema/product";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  InitailProduct?: SelectProduct;
};

const ProductPage = ({ InitailProduct }: Props) => {
  const form = useForm<NewProduct>({
    resolver: zodResolver(InsertProductSchema),
    defaultValues: {
      title: InitailProduct?.title ?? "",
      description: InitailProduct?.description ?? "",
      price: InitailProduct?.price ?? 0,
      stock: InitailProduct?.stock ?? 0,
      view_count: InitailProduct?.view_count ?? 0,
      reviews_count: InitailProduct?.reviews_count ?? 0,
      is_active: InitailProduct?.is_active ?? true,
      category_id: InitailProduct?.category_id ?? 0,
      sizes: InitailProduct?.sizes ?? [],
      colors: InitailProduct?.colors ?? [],
      images_by_color: InitailProduct?.images_by_color ?? {},
    },
  });

  const { handleSubmit } = form;

  return <div>ProductPage</div>;
};

export default ProductPage;
