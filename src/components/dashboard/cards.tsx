"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  // ArrowDownRight,
  // ArrowUpRight,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardStats, getDashboardStats } from "@/app/actions/statistique";

export const DashboardCards = () => {
  const [stats, setStats] = useState<DashboardStats>();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res) setStats(res);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  const data = [
    {
      title: "Revenue",
      value: `${stats.revenue} DZD`,
      icon: TrendingUp,
      trend: "up",
      change: "+8%",
      description: "this month",
    },
    {
      title: "Orders",
      value: stats.ordersCount,
      icon: ShoppingCart,
      trend: "up",
      change: "+12%",
      description: "vs last week",
    },
    {
      title: "Users",
      value: stats.usersCount,
      icon: Users,
      trend: "up", // you can calculate real trends if you want
      change: "+5%",
      description: "since last month",
    },
    {
      title: "Active Status",
      value:
        stats.ordersByStatus?.find((s) => s.status === "active")?.count || 0,
      icon: Package,
      trend: "down",
      change: "-3%",
      description: "orders cancelled",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground flex items-center">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </p> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
