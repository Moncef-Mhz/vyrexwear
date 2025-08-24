"use server";
import { db } from "@/db";
import { orders, SimplifiedCartItem, OrderStatus } from "@/db/schema/orders";
import { NewOrder } from "@/db/schema/orders";
import { sendTelegramMessage } from "@/lib/telegram";
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

    if (!newOrder) {
      throw new Error("Order creation failed");
    }

    const fullName = `${newOrder.userInfo?.firstName} ${newOrder.userInfo?.lastName}`;
    const phone = `${newOrder.userInfo?.phoneNumber1}${
      newOrder.userInfo?.phoneNumber2
        ? " / " + newOrder.userInfo?.phoneNumber2
        : ""
    }`;

    const itemsList = newOrder.items
      ?.map(
        (item, i) =>
          `${i + 1}. ${item.title} (${item.color}, ${item.size}) x${
            item.quantity
          } - ${item.price}DA`
      )
      .join("\n");

    const date = new Date(newOrder.created_at).toLocaleString("fr-DZ", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const message =
      `🛒 *New Order Received*\n\n` +
      `📌 Order ID: ${newOrder.id}\n` +
      `👤 Customer: *${fullName}*\n` +
      `📞 Phone: ${phone}\n` +
      `🏠 Address: ${newOrder.userInfo?.address}, ${newOrder.userInfo?.commune}, ${newOrder.userInfo?.wilaya}\n` +
      `🚚 Shipping: ${newOrder.userInfo?.shippingMethod}\n\n` +
      `📦 *Items:*\n${itemsList}\n\n` +
      `💰 Total: ${newOrder.totalPrice}DA\n` +
      `📦 Quantity: ${newOrder.totalQuantity}\n` +
      `🚚 Shipping Costs: ${newOrder.shippingCosts}DA\n\n` +
      `🗓️ Date: ${date}`;

    await sendTelegramMessage(message);

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

export const getOrders = async () => {
  try {
    const allOrders = await db.select().from(orders);
    return allOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

export const getOrderById = async (id: number) => {
  try {
    const order = await db.select().from(orders).where(eq(orders.id, id));
    if (order.length === 0) {
      throw new Error("Order not found");
    }
    return order[0];
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw new Error("Failed to fetch order");
  }
};

export const deleteOrder = async (id: number) => {
  try {
    const res = await db.delete(orders).where(eq(orders.id, id));
    if (res.rowCount === 0) {
      throw new Error("Order not found");
    }
    return { success: "Order deleted successfully" };
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
};
