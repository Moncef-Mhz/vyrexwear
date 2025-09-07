"use client";
import {
  InsertProductSchema,
  NewProduct,
  SelectProduct,
  sizeOptions,
} from "@/db/schema/product";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getCategories } from "@/app/actions/categories";

import { MultiSelect } from "../ui/multi-select";
import { COLOR_CLASSES, COLORS } from "@/constant";
import { useFileUpload } from "@/hooks/use-upload-image";
import { UploaderProvider } from "../upload/uploader-provider";
import { ImageUploader } from "../upload/multi-image";
import { createProduct, updateProduct } from "@/app/actions/products";
import { useParams, useRouter } from "next/navigation";
import { ProductRelation } from "@/types/products";
import { SelectCategory } from "@/db/schema/categories";

type Props = {
  InitailProduct?: SelectProduct;
  InitialCategories?: ProductRelation[];
};

const ProductPage = ({ InitailProduct, InitialCategories }: Props) => {
  const [categories, setCategories] = useState<SelectCategory[]>([]);
  const [collections, setCollections] = useState<SelectCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesIds, setCategoriesIds] = useState<number[]>(
    InitialCategories?.map((cat) => cat.categories?.id).filter(
      (id): id is number => typeof id === "number"
    ) || []
  );

  const params = useParams();
  const router = useRouter();
  const { deleteFile, uploadFile } = useFileUpload();

  const isEditing = params?.id !== undefined && !isNaN(Number(params.id));

  const form = useForm<NewProduct>({
    resolver: zodResolver(InsertProductSchema),
    defaultValues: {
      title: InitailProduct?.title ?? "",
      description: InitailProduct?.description ?? "",
      price: InitailProduct?.price ?? 0,
      stock: InitailProduct?.stock ?? 0,
      view_count: InitailProduct?.view_count ?? 0,
      reviews_count: InitailProduct?.reviews_count ?? 0,
      is_active: InitailProduct?.is_active ?? true,
      sizes: InitailProduct?.sizes ?? [],
      colors: InitailProduct?.colors ?? [],
      images_by_color: InitailProduct?.images_by_color ?? {},
    },
  });

  const { handleSubmit, setValue, watch } = form;

  const colors = watch("colors") || [];
  const imagesByColor = watch("images_by_color") || {};

  useEffect(() => {
    if (InitailProduct) {
      Object.entries(InitailProduct).forEach(([key, value]) => {
        setValue(key as keyof NewProduct, value);
      });
    }
  }, [InitailProduct, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (res) {
        setCategories(res.res);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const res = await getCategories();
      if (res) {
        setCollections(res.res);
      }
    };
    fetchCollections();
  }, []);
  console.log(collections);

  const onSubmit = useCallback(
    async (data: NewProduct) => {
      try {
        setLoading(true);

        if (isEditing) {
          const res = await updateProduct(Number(params.id), data);

          if (res.error) {
            console.error("Error updating product:", res.error);
            return;
          }
          if (res.product) {
            console.log("Product updated successfully:", res.product);
            router.refresh();
          }
        } else {
          const res = await createProduct(data, categoriesIds);

          if (res.error) {
            console.error("Error creating product:", res.error);
            return;
          }
          if (res.product) {
            console.log("Product created successfully:", res.product);
            router.push(`/admin/products/${res.product.id}`);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    },
    [categoriesIds, router, params.id, isEditing]
  );

  return (
    <div className="max-w-3xl mx-auto md:p-6 space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    className="text-sm"
                    placeholder="Product title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                    className="text-sm"
                    placeholder="Product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ?? ""}
                      type="number"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ?? ""}
                      type="number"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full space-y-2">
            <FormLabel>Category</FormLabel>
            <MultiSelect
              value={categoriesIds.map((id) => id.toString())}
              onValueChange={(selected) => {
                console.log("Selected categories:", selected);
                setCategoriesIds(selected.map((id) => parseInt(id)));
              }}
              options={categories.map((cat) => ({
                label: `${cat.name}`,
                value: cat.id.toString(),
              }))}
              placeholder="Select categories"
              variant={"inverted"}
            />
          </div>

          {/* Sizes */}
          <FormField
            control={form.control}
            name={"sizes"}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Sizes</FormLabel>
                <FormControl>
                  <MultiSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={sizeOptions.map((size) => ({
                      label: size,
                      value: size,
                    }))}
                    placeholder="Select sizes"
                    maxCount={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Colors */}
          <div>
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Colors</FormLabel>
                  <FormControl>
                    <MultiSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={COLORS.map((color) => ({
                        label: color,
                        value: color,
                      }))}
                      placeholder="Select colors"
                      maxCount={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {colors.map((color) => (
            <div key={color} className="space-y-4 relative">
              <h4 className="font-semibold flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full  ${
                    COLOR_CLASSES[color as keyof typeof COLOR_CLASSES]
                  }`}
                />{" "}
                {color} Images
              </h4>
              <UploaderProvider
                uploadFn={async ({ file, onProgressChange, signal }) => {
                  const res = await uploadFile(file, {
                    signal,
                    onProgressChange,
                  });

                  if (res && res.url) {
                    const prev = form.getValues("images_by_color");
                    const currentImages = prev[color] || [];

                    setValue("images_by_color", {
                      ...prev,
                      [color]: [...currentImages, res.url],
                    });

                    return { url: res.url };
                  }
                  throw new Error("Upload failed");
                }}
                onFileRemoved={async (url) => {
                  const res = await deleteFile(url);
                  if (res) {
                    const prev = form.getValues("images_by_color");
                    const currentImages = prev[color] || [];
                    const updatedImages = currentImages.filter(
                      (img) => img !== url
                    );

                    setValue("images_by_color", {
                      ...prev,
                      [color]: updatedImages,
                    });
                  }
                }}
                value={(imagesByColor[color] || []).map((url) => ({
                  file: new File([], url),
                  key: url,
                  progress: 100,
                  status: "COMPLETE" as const,
                  url,
                }))}
                autoUpload
                key={color}
              >
                <ImageUploader maxFiles={4} maxSize={1024 * 1024 * 4} />
              </UploaderProvider>
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant={"outline"}
              disabled={loading}
              className=""
              onClick={() => {
                form.setValue("is_active", false);
                onSubmit(form.getValues());
              }}
            >
              {loading ? "Saving..." : "Save for later"}
            </Button>
            <Button type="submit" disabled={loading} className="">
              {loading ? "Saving..." : "Save product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductPage;
