import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SelectCollection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;

export const InsertCollectionSchema = createInsertSchema(collections, {
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type NewCollection = z.infer<typeof InsertCollectionSchema>;
