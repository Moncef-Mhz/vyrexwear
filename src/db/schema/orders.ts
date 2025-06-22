import { ColorName } from "@/constant";
import { integer, json, pgTable, text } from "drizzle-orm/pg-core";
import { Sizes } from "./product";
import { timestamps } from "@/lib/schema-helpers";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type UserInfo = {
  firstName: string;
  lastName: string;
  phoneNumber1: string;
  phoneNumber2: string;
  wilaya: string;
  commune: string;
  address: string;
};

export type SimplifiedCartItem = {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  color: ColorName;
  size: Sizes;
  image: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userInfo: json("user_info").$type<UserInfo>(),
  items: json("items").$type<SimplifiedCartItem[]>(),
  status: text("status").$type<OrderStatus>().default("pending"),
  ...timestamps,
});

export type SelectOrder = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const insertOrderSchema = createInsertSchema(orders, {
  userInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNumber1: z.string().min(6),
    phoneNumber2: z.string().optional().nullable(),
    wilaya: z.string().min(1),
    commune: z.string().min(1),
    address: z.string().min(1),
  }),
  items: z.array(
    z.object({
      productId: z.number(),
      title: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      color: z.string(),
      size: z.string(),
      image: z.string().url().or(z.literal("")),
    })
  ),
  status: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
});

export type NewOrder = Omit<
  z.infer<typeof insertOrderSchema>,
  "created_at" | "updated_at"
>;
