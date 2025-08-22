"use server";
import { db } from "@/db";
import { categories } from "@/db/schema/categories";
import { InsertCategory, NewCategory } from "@/db/schema/categories";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const createCategory = async (data: NewCategory) => {
  try {
    const { name, slug, description, parent_id, is_active } = data;

    // Validate the data
    if (!name || !slug) {
      throw new Error("Name and slug are required");
    }

    const existingCategory = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, slug), isNull(categories.parent_id)));

    if (existingCategory.length > 0) {
      throw new Error("A root category with this slug already exists");
    }

    // Create the category object
    const newCategory: InsertCategory = {
      name,
      slug,
      description: description || "",
      parent_id: parent_id != null ? parent_id : undefined,
      is_active: is_active !== undefined ? is_active : true,
    };

    // Here you would typically send the newCategory to your API or database
    const res = await db.insert(categories).values(newCategory).returning();

    return { res, success: "Category created successfully" };
  } catch (error) {
    console.error("Error creating category:", error);
  }
};

export const updateCategory = async (
  id: number,
  data: Partial<NewCategory>
) => {
  try {
    const { name, slug, description, parent_id, is_active } = await data;

    // Validate the data
    if (!name && !slug) {
      throw new Error("Name or slug is required");
    }

    // Create the category object
    const updatedCategory: Partial<InsertCategory> = {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(parent_id !== undefined && parent_id !== null && { parent_id }),
      ...(is_active !== undefined && { is_active }),
    };

    // Here you would typically send the updatedCategory to your API or database
    const res = await db
      .update(categories)
      .set(updatedCategory)
      .where(eq(categories.id, id))
      .returning();

    return { res, success: "Category updated successfully" };
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

export const deleteCategory = async (id: number) => {
  try {
    await db.delete(categories).where(eq(categories.id, id));

    return { success: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

export const getCategories = async () => {
  try {
    const res = await db.select().from(categories);

    return { res, success: "Categories fetched successfully" };
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    return category[0];
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

export const getParentCategories = async () => {
  const parentCategories = await db
    .select()
    .from(categories)
    .where(isNull(categories.parent_id));

  return parentCategories;
};

const parent = alias(categories, "parent");

export const getChildsCategories = async () => {
  const res = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      parent_id: categories.parent_id,
      is_active: categories.is_active,
      created_at: categories.created_at,
      updated_at: categories.updated_at,
      parent: {
        id: parent.id,
        name: parent.name,
        slug: parent.slug,
        description: parent.description,
        is_active: parent.is_active,
        updated_at: parent.updated_at,
        created_at: parent.created_at,
        parent_id: parent.parent_id,
      },
    })
    .from(categories)
    .leftJoin(parent, eq(categories.parent_id, parent.id))
    .where(isNotNull(categories.parent_id));

  return { res, success: "Categories fetched successfully" };
};
