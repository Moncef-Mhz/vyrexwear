"use client";
import {
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "@/app/actions/orders";
import { SelectOrder } from "@/db/schema/orders";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  EllipsisVertical,
  Eye,
  MapPin,
  Pen,
  Phone,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatMoney } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const OrderMain = () => {
  const [orders, setOrders] = useState<SelectOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getOrders();

        const data = await res;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id: number) => {
    try {
      const res = await deleteOrder(id);
      if (res.success) {
        setOrders((prev) => prev.filter((order) => order.id !== id));
        console.log("Order deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleViewOrder = (id: number) => {
    router.push(`/admin/orders/${id}`);
  };

  const handleEditOrder = (id: number) => {
    router.push(`/admin/orders/${id}/edit`);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setUpdatingStatus(id);
      const res = await updateOrderStatus(id, status);

      if (res.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id
              ? { ...order, status: status as typeof order.status }
              : order
          )
        );
        console.log("Order status updated successfully");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-8">
        <CardContent className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Truck strokeWidth={1} className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No orders found</h3>
            <p className="text-muted-foreground">
              Orders will appear here once customers start placing them.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Shipping Detials</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="h-20 even:bg-muted/20">
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold flex items-center gap-1">
                        <User className="size-4 text-muted-foreground" />{" "}
                        {order.userInfo?.firstName} {order.userInfo?.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="size-4 text-muted-foreground" />
                        {order.userInfo?.phoneNumber1}
                      </span>
                      <span className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                        <MapPin className="size-4 text-muted-foreground" />
                        {order.userInfo?.wilaya} - {order.userInfo?.commune}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {order.items?.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={60}
                            height={60}
                            className="rounded object-cover"
                          />
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.size} • {item.color} • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-lg">
                        {formatMoney(order?.totalPrice ?? 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Qty: {order.totalQuantity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium capitalize">
                          {order.shippingMethod || "StopDesk"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Cost: {formatMoney(order?.shippingCosts ?? 0)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Select
                      value={order.status ?? "pending"}
                      onValueChange={(newStatus) =>
                        handleUpdateStatus(order.id, newStatus)
                      }
                      disabled={updatingStatus === order.id}
                    >
                      <SelectTrigger
                        className={`w-32 h-8 ${getStatusColor(
                          order.status ?? "pending"
                        )} border-0 font-medium text-xs cursor-pointer ${
                          updatingStatus === order.id ? "opacity-50" : ""
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="confirmed">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Processing
                          </div>
                        </SelectItem>
                        <SelectItem value="shipped">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Shipped
                          </div>
                        </SelectItem>
                        <SelectItem value="delivered">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Delivered
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Cancelled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>

                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 mr-8">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditOrder(order.id)}
                        >
                          <Pen />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteOrder(order.id)}
                          variant="destructive"
                        >
                          <Trash2 />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default OrderMain;
