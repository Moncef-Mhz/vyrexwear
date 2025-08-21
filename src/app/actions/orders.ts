"use server";
import { db } from "@/db";
import { orders, SimplifiedCartItem, OrderStatus } from "@/db/schema/orders";
import { NewOrder } from "@/db/schema/orders";
import { eq } from "drizzle-orm";

type OrderPayload = NewOrder & {
  totalPrice: number;
  totalQuantity: number;
  shippingCosts: number;
};

export async function createOrder(data: OrderPayload) {
  try {
    // insert into DB (ignoring extra fields)
    const [newOrder] = await db
      .insert(orders)
      .values({
        userInfo: {
          ...data.userInfo,
          phoneNumber2: data.userInfo.phoneNumber2 ?? "",
        },
        items: data.items as SimplifiedCartItem[],
        status: data.status ?? "pending",
        totalPrice: data.totalPrice,
        totalQuantity: data.totalQuantity,
        shippingCosts: data.shippingCosts,
      })
      .returning();

    console.log("✅ Order created:", newOrder);

    return { success: true, order: newOrder };
  } catch (err) {
    console.error("❌ Failed to create order:", err);
    return { success: false, error: "Failed to create order" };
  }
}

export const updateOrderStatus = async (id: number, status: string) => {
  try {
    // Validate the status
    if (
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
      throw new Error("Invalid order status");
    }

    // Update the order status in the database
    const res = await db
      .update(orders)
      .set({ status: status as OrderStatus })
      .where(eq(orders.id, id))
      .returning();

    return { res, success: "Order status updated successfully" };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};
