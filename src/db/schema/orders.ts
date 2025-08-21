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
  phoneNumber2?: string | null; // ✅ matches zod + db
  wilaya: string;
  commune: string;
  address: string;
  shippingMethod: "stopdesk" | "domicile";
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
  totalPrice: integer("total_price"),
  totalQuantity: integer("total_quantity"),
  shippingCosts: integer("shipping_costs"),
  shippingMethod: text("shipping_method")
    .$type<"stopdesk" | "domicile">()
    .default("stopdesk"),
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
    shippingMethod: z.enum(["stopdesk", "domicile"]),
  }),
  items: z.array(
    z.object({
      productId: z.number().optional(),
      title: z.string().optional(),
      price: z.number().optional(),
      quantity: z.number().min(1).optional(),
      color: z.string(),
      size: z.string(),
      image: z.string().url().or(z.literal("")).optional(),
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
