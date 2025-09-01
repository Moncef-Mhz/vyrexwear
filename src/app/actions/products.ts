"use server";

import { productCategories, products } from "@/db/schema/product";
import { db } from "@/db";
import { InsertProductSchema, NewProduct } from "@/db/schema/product";

import { desc, eq } from "drizzle-orm";
import { categories } from "@/db/schema/categories";
import { ProductRelation } from "@/types/products";

export const createProduct = async (
  formData: NewProduct,
  category_id?: number[]
) => {
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
    const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

    const insertData = {
      ...formData,
      sizes: Array.isArray(formData.sizes)
        ? formData.sizes.filter((size): size is (typeof allowedSizes)[number] =>
            allowedSizes.includes(size as (typeof allowedSizes)[number])
          )
        : formData.sizes,
    };

    // 1. Insert product (no category_id field here!)
    const [insertedProduct] = await db
      .insert(products)
      .values(insertData)
      .returning();

    // 2. Insert product-category relations
    if (insertedProduct && Array.isArray(category_id)) {
      const categoryValues = category_id.map((categoryId: number) => ({
        productId: insertedProduct.id,
        categoryId,
      }));

      await db.insert(productCategories).values(categoryValues);
    }

    return {
      success: "Product created successfully.",
      product: insertedProduct,
    };
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return { error: "Internal server error." };
  }
};

export const getProductbyId = async (id: number) => {
  try {
    const product = await db.select().from(products).where(eq(products.id, id));

    if (product.length === 0) {
      return { error: "Product not found." };
    }

    const categoryRelationsRaw = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.productId, id))
      .leftJoin(categories, eq(productCategories.categoryId, categories.id));

    const categoryRelations = categoryRelationsRaw as ProductRelation[];

    return { product: product[0], categoryRelations };
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return { error: "Internal server error." };
  }
};

export const updateProduct = async (id: number, data: NewProduct) => {
  try {
    const validated = InsertProductSchema.safeParse(data);

    if (!validated.success) {
      return {
        error: "Validation failed",
        issues: validated.error.flatten().fieldErrors,
      };
    }

    // ✅ Update product
    const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
    const updateData = {
      ...validated.data,
      sizes: Array.isArray(validated.data.sizes)
        ? validated.data.sizes.filter(
            (size): size is (typeof allowedSizes)[number] =>
              allowedSizes.includes(size as (typeof allowedSizes)[number])
          )
        : validated.data.sizes,
      updated_at: new Date(),
    };
    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    return {
      success: "Product updated successfully.",
      product: updatedProduct,
    };
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return { error: "Internal server error." };
  }
};

export const getProducts = async () => {
  try {
    const productList = await db
      .select()
      .from(products)
      .orderBy(desc(products.created_at));

    return { products: productList };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { error: "Internal server error." };
  }
};

export const getLatestProducts = async () => {
  try {
    const productList = await db
      .select()
      .from(products)
      .orderBy(desc(products.created_at)).limit(3);

    return { products: productList };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { error: "Internal server error." };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (existingProduct.length === 0) {
      return { error: "Product not found." };
    }

    // Delete product-category relations first
    await db
      .delete(productCategories)
      .where(eq(productCategories.productId, id));

    // Then delete the product itself
    const result = await db.delete(products).where(eq(products.id, id));

    if (result.rowCount === 0) {
      return { error: "Failed to delete product." };
    }

    return { success: "Product deleted successfully." };
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return { error: "Internal server error." };
  }
};

