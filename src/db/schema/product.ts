import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const productTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 100 }),
});
