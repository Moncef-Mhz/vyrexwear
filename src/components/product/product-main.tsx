"use client";
import {
  BoxesIcon,
  EllipsisVertical,
  Eye,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SelectProduct } from "@/db/schema/product";
import { deleteProduct, getProducts } from "@/app/actions/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { COLOR_CLASSES } from "@/constant";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const ProductMain = () => {
  const [products, setProducts] = useState<SelectProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        if (res.error) {
          console.error("Error fetching products:", res.error);
          setProducts([]);
        } else if (res.products) {
          setProducts(res.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await deleteProduct(id);
      if (res.error) {
        console.error("Error deleting product:", res.error);
      } else {
        setProducts((prev) => prev.filter((product) => product.id !== id));
        console.log("Product deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddProduct = () => {
    router.push("/admin/products/new");
  };

  const handleViewProduct = (id: number) => {
    router.push(`/shop/products/${id}`);
  };

  const handleEditProduct = (id: number) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button className="cursor-pointer" onClick={handleAddProduct}>
          <Plus />
          Product
        </Button>
      </div>
      {products.length === 0 || !products ? (
        <Card className="p-8">
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <BoxesIcon
                strokeWidth={1}
                className="w-8 h-8 text-muted-foreground"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Products found</h3>
              <p className="text-muted-foreground">
                Product will appear here once you start placing them.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sizes</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell>Loading</TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const productColors = product.colors?.map((color) => (
                    <div
                      key={color}
                      className={`w-4 h-4 rounded-full outline-2 ${
                        COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] ??
                        "bg-white"
                      }`}
                    />
                  ));

                  const firstImage =
                    (product.images_by_color &&
                      Object.values(product.images_by_color)[0]?.[0]) ??
                    "";

                  return (
                    <TableRow
                      key={product.id}
                      className="h-20 even:bg-muted/20"
                    >
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Image
                            src={firstImage}
                            alt={product.title}
                            width={100}
                            height={100}
                            className="w-14 h-14 object-cover rounded"
                            loading="lazy"
                          />
                          {product.title}
                        </div>
                      </TableHead>
                      <TableHead>{formatMoney(product.price)}</TableHead>
                      <TableHead>
                        <div className="flex gap-2">
                          {(product.sizes ?? []).map((item) => (
                            <Badge key={item} variant={"outline"}>
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex gap-2 ">{productColors}</div>
                      </TableHead>
                      <TableHead>{product.view_count}</TableHead>
                      <TableHead className="text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              <EllipsisVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48 mr-8">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewProduct(product.id)}
                            >
                              <Eye />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product.id)}
                            >
                              <Pen />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProduct(product.id)}
                              variant="destructive"
                            >
                              <Trash2 />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
export default ProductMain;
