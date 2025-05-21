"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const ProductMain = () => {
  const router = useRouter();

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
    </div>
  );
};
export default ProductMain;
