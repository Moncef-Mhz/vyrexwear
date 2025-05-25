"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SelectProduct } from "@/db/schema/product";
import { getProducts } from "@/app/actions/products";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { COLOR_CLASSES } from "@/constant";
import { formatMoney } from "@/lib/utils";

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

  const handleAddProduct = () => {
    router.push("/admin/products/new");
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
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>Loading</>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="h-14 even:bg-muted/20">
                  <TableHead>{product.title}</TableHead>
                  <TableHead>{formatMoney(product.price)}</TableHead>
                  <TableHead>{(product.sizes ?? []).join(", ")}</TableHead>
                  <TableHead>
                    {product.colors?.map((color) => (
                      <div
                        key={color}
                        className={`w-4 h-4 rounded-full outline-2 ${
                          COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] ??
                          "bg-white"
                        }`}
                      />
                    ))}
                  </TableHead>
                  <TableHead>{product.view_count}</TableHead>
                  <TableHead>
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/products/${product.id}`)
                      }
                    >
                      Edit
                    </Button>
                  </TableHead>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ProductMain;
