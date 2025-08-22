"use client";

import {
  InsertCategorySchema,
  NewCategory,
  SelectCategory,
} from "@/db/schema/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { Switch } from "../ui/switch";
import { createCategory, updateCategory } from "@/app/actions/categories";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const CategoryPage = (category: { category?: SelectCategory }) => {
  const cat = category.category;
  const isEditMode = !!cat;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<NewCategory>({
    resolver: zodResolver(InsertCategorySchema),
    defaultValues: {
      name: cat?.name ?? "",
      slug: cat?.slug ?? "",
      description: cat?.description || "",
      is_active: cat?.is_active ?? true,
    },
  });
  const { handleSubmit, control } = form;

  const watchName = form.watch("name");

  useEffect(() => {
    if (!isEditMode || !form.getValues("slug")) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchName, form, isEditMode]);

  const onSubmit = async (data: NewCategory) => {
    if (loading) return;

    try {
      setLoading(true);

      const categoryData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parent_id: data.parent_id,
        is_active: data.is_active,
      };

      if (isEditMode) {
        try {
          const update = await updateCategory(cat.id, categoryData);

          console.log("Category updated:", update);
          toast("Category has been created successfully");
        } catch (error) {
          console.error("Error updating category:", error);
        }
      } else {
        try {
          const create = await createCategory(categoryData);

          router.push(`/admin/categories/${create?.res[0].id}`);
          toast("Category has been created successfully");
        } catch (error) {
          console.error("Error creating category:", error);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center ">
          <Link href={"/admin/categories"} className="flex items-center mr-4">
            <ChevronLeft />
          </Link>{" "}
          {isEditMode ? "Edit Category" : "Create Category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input readOnly placeholder="category-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL-friendly identifier (auto-generated from name).
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Category description"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this category.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 ">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoryPage;
