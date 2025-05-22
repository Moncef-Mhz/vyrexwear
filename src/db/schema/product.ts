import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { timestamps } from "@/lib/schema-helpers";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  view_count: integer("view_count").default(0),
  reviews_count: integer("reviews_count").default(0),

  price: integer("price").notNull(),
  stock: integer("stock").default(0),
  is_active: boolean("is_active").default(true),

  category_id: integer("category_id")
    .references(() => categories.id)
    .notNull(),

  sizes: json("sizes").$type<string[]>(),
  colors: json("colors").$type<string[]>(),

  images_by_color: json("images_by_color").$type<Record<string, string[]>>(),

  ...timestamps,
});

export type SelectProduct = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const InsertProductSchema = createInsertSchema(products, {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock must be 0 or greater").default(0),
  view_count: z.number().default(0),
  reviews_count: z.number().default(0),
  is_active: z.boolean().default(true),

  category_id: z.number(),

  sizes: z.array(z.string()).nonempty("At least one size is required"),
  colors: z.array(z.string()).nonempty("At least one color is required"),

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
