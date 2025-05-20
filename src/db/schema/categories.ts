import { timestamps } from "@/lib/schema-helpers";
import {
  serial,
  pgTable,
  text,
  AnyPgColumn,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default(""),
  parent_id: serial("parent_id").references((): AnyPgColumn => categories.id),
  is_active: boolean("is_active").default(true),
  position: integer("position").default(0),
  ...timestamps,
});

export type SelectCategory = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export const InsertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parent_id: z.number().optional().nullable(),
  is_active: z.boolean().default(true),
  position: z.number().default(0),
}).omit({
  id: true,
  created_at: true,
});

export type NewCategory = z.infer<typeof InsertCategorySchema>;
