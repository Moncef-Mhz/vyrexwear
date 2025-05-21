"use server";

import { products } from "@/db/schema/product";
import { db } from "@/db";
import { InsertProductSchema, NewProduct } from "@/db/schema/product";

import { eq } from "drizzle-orm";

export const createProduct = async (formData: NewProduct) => {
  try {
    const validated = InsertProductSchema.safeParse(formData);

    if (!validated.success) {
      return {
        error: "Validation failed",
        issues: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    const existingArr = await db
      .select()
      .from(products)
      .where(eq(products.title, data.title))
      .limit(1);

    const existing = existingArr[0];

    if (existing) {
      return { error: "A product with this title already exists." };
    }

    // ✅ Insert into DB
    const inserted = await db
      .insert(products)
      .values({
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        view_count: data.view_count ?? 0,
        reviews_count: data.reviews_count ?? 0,
        is_active: data.is_active ?? true,
        category_id: data.category_id,
        sizes: data.sizes,
        colors: data.colors,
        images_by_color: data.images_by_color,
      })
      .returning();

    return {
      success: "Product created successfully.",
      product: inserted[0],
    };
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return { error: "Internal server error." };
  }
};
