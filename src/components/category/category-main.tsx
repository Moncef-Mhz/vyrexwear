"use client";

import { Pen, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SelectCategory } from "@/db/schema/categories";
import { deleteCategory, getCategories } from "@/app/actions/categories";
import Link from "next/link";
import { toast } from "sonner";

const CategoriesMain = () => {
  const [categories, setCategories] = useState<SelectCategory[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (res) {
        setCategories(res?.res);
        console.log(res.res);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    router.push("/admin/categories/new");
  };

  const handleDeleteCategory = async (id: number) => {
    const res = await deleteCategory(id);
    if (res) {
      toast.success("Category deleted successfully");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } else {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button className="cursor-pointer" onClick={handleAddCategory}>
          <Plus />
          Category
        </Button>
      </div>
      <div className="border rounded-md overflow-hidden">
        <Table className="">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>ID</TableHead>
              <TableHead className="min-w-[250px]">Category</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="h-14 even:bg-muted/20">
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.parent_id ?? "-"}</TableCell>
                <TableCell>
                  {category.is_active ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>{category.position}</TableCell>
                <TableCell>
                  {new Date(category.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 justify-end">
                    <Link href={`/admin/categories/${category.id}`}>
                      <Pen className="w-4 h-4" />
                    </Link>
                    <div onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="text-destructive h-4 w-4 " />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default CategoriesMain;
