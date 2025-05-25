"use client";
import {
  InsertProductSchema,
  NewProduct,
  SelectProduct,
  sizeOptions,
} from "@/db/schema/product";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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
import { getChildsCategories } from "@/app/actions/categories";

import { MultiSelect } from "../ui/multi-select";
import { ChildCategories } from "@/types/categories";
import { COLOR_CLASSES, COLORS } from "@/constant";
import { useFileUpload } from "@/hooks/use-upload-image";
import { UploaderProvider } from "../upload/uploader-provider";
import { ImageUploader } from "../upload/multi-image";

type Props = {
  InitailProduct?: SelectProduct;
};

const ProductPage = ({ InitailProduct }: Props) => {
  const [categories, setCategories] = useState<ChildCategories[]>([]);
  const { uploadFile, deleteFile } = useFileUpload();

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
      category_id: Array.isArray(InitailProduct?.category_id)
        ? InitailProduct?.category_id
        : typeof InitailProduct?.category_id === "number"
        ? [InitailProduct.category_id]
        : [],
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
      const res = await getChildsCategories();
      if (res) {
        setCategories(res.res);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: NewProduct) => {
    console.log("Form submitted", data);
    // Handle form submission logic here
  };

  console.log("Form values:", form.getValues("category_id"));

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product title" {...field} />
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
                  <Textarea placeholder="Product description" {...field} />
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
                      value={field.value}
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      value={field.value}
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <MultiSelect
                    value={
                      Array.isArray(field.value) ? field.value.map(String) : []
                    }
                    onValueChange={(selected) => {
                      console.log("Selected categories:", selected);
                      field.onChange(selected.map((id) => parseInt(id)));
                    }}
                    options={categories.map((cat) => ({
                      label: `${cat.parent?.name} > ${cat.name}`,
                      value: cat.id.toString(),
                    }))}
                    placeholder="Select categories"
                    variant={"inverted"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                uploadFn={async ({ file }) => {
                  const res = await uploadFile(file);
                  if (res && res.url) {
                    console.log("Upload response:", res.url);
                    // Update imagesByColor state for this color
                    const currentImages = imagesByColor[color] || [];
                    setValue("images_by_color", {
                      ...imagesByColor,
                      [color]: [...currentImages, res.url],
                    });
                    return { url: res.url };
                  }
                  throw new Error("Upload failed");
                }}
                onFileRemoved={async (url) => {
                  console.log("Removing file:", url);
                  const res = await deleteFile(url);

                  if (res) {
                    // Remove the image from imagesByColor state for this color
                    const currentImages = imagesByColor[color] || [];
                    const updatedImages = currentImages.filter(
                      (img) => img !== url
                    );
                    setValue("images_by_color", {
                      ...imagesByColor,
                      [color]: updatedImages,
                    });
                  }
                }}
                autoUpload
                key={color}
              >
                <ImageUploader
                  maxFiles={4}
                  maxSize={1024 * 1024 * 4} // 4 MB
                />
              </UploaderProvider>
            </div>
          ))}

          <Button type="submit" className="w-full">
            Save Product
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductPage;
