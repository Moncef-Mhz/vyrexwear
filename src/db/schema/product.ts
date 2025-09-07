import {
  boolean,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { timestamps } from "@/lib/schema-helpers";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { collections } from "./collections";

export const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Sizes = (typeof sizeOptions)[number];

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  view_count: integer("view_count").default(0),
  reviews_count: integer("reviews_count").default(0),

  price: integer("price").notNull(),
  stock: integer("stock").default(0),
  is_active: boolean("is_active").default(true),

  sizes: json("sizes").$type<Sizes[]>(),
  colors: json("colors").$type<string[]>(),

  images_by_color: json("images_by_color").$type<Record<string, string[]>>(),

  ...timestamps,
});

export const productCategories = pgTable(
  "product_categories",
  {
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    collectionId: integer("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.categoryId] }),
  })
);

export type SelectProduct = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const InsertProductSchema = createInsertSchema(products, {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price must be greater than 0"),

  stock: z.number().min(0, "Stock must be 0 or greater"),
  view_count: z.number(),
  reviews_count: z.number(),
  is_active: z.boolean(),

  sizes: z.array(z.string()),
  colors: z.array(z.string()),

  images_by_color: z
    .record(
      z.string(),
      z.array(z.string().url("Each image must be a valid URL"))
    )
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "At least one color-image mapping is required",
    }),
}).omit({
  created_at: true,
});

// Types
export type NewProduct = z.infer<typeof InsertProductSchema>;
