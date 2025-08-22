"use server";
import { db } from "@/db";
import { user } from "@/db/schema/user";
import { orders } from "@/db/schema/orders";
import { sql } from "drizzle-orm";

export type DashboardStats = {
  usersCount: number;
  ordersCount: number;
  revenue: number;
  ordersByStatus: { status: string; count: number }[];
  monthlyOrders: { month: string; count: number }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [usersCount] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(user);

  const [ordersCount] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders);

  const [revenue] = await db
    .select({ sum: sql<number>`COALESCE(SUM(${orders.totalPrice}), 0)` })
    .from(orders);

  const ordersByStatus = await db
    .select({
      status: orders.status,
      count: sql<number>`COUNT(${orders.id})`,
    })
    .from(orders)
    .groupBy(orders.status);

  const monthlyOrders = await db
    .select({
      month: sql<string>`TO_CHAR(${orders.created_at}, 'YYYY-MM')`,
      count: sql<number>`COUNT(${orders.id})`,
    })
    .from(orders)
    .groupBy(sql`TO_CHAR(${orders.created_at}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${orders.created_at}, 'YYYY-MM')`);

  return {
    usersCount: usersCount.count,
    ordersCount: ordersCount.count,
    revenue: revenue.sum,
    ordersByStatus: ordersByStatus.map(({ status, count }) => ({
      status: status ?? "",
      count,
    })),
    monthlyOrders,
  };
}
