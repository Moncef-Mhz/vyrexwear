"use client";
import { SelectProduct, Sizes } from "@/db/schema/product";
import { Gutter } from "../global/Gutter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Minus, Plus, Slash } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatMoney } from "@/lib/utils";
import Image from "next/image";
import { StarRating } from "../shop/product-card";
import {
  COLOR_CLASSES,
  ColorName,
  outlineColorClasses,
  SIZES,
} from "@/constant";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useCart } from "@/context/cart-context";

const ProductDetails = ({ product }: { product: SelectProduct }) => {
  const [selectedColor, setSelectedColor] = useState<ColorName>(
    (product.colors?.[0] as ColorName) ?? "Black"
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Sizes>("M");
  const [quantity, setQuantity] = useState(1);

  const { addToCart, handleOpenCart } = useCart();

  const segments = usePathname().split("/").filter(Boolean);

  const breadcrumbItems = segments.flatMap((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;

    return [
      <BreadcrumbItem key={`item-${href}`}>
        {isLast ? (
          <span className="capitalize text-muted-foreground">
            {product.title}
          </span>
        ) : (
          <BreadcrumbLink href={href} className="capitalize">
            {segment}
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>,
      !isLast && (
        <BreadcrumbSeparator key={`sep-${href}`}>
          <Slash />
        </BreadcrumbSeparator>
      ),
    ];
  });

  useEffect(() => {
    let images: string[] | undefined;
    if (selectedColor !== null) {
      images = product.images_by_color?.[selectedColor];
    }
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [selectedColor, product.images_by_color]);

  const limitStock = product.stock ?? 0;

  const addQuantity = () => {
    if (quantity < limitStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const removeQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      product: product,
      color: selectedColor,
      quantity: quantity,
      size: selectedSize,
    });

    handleOpenCart();
  };

  return (
    <Gutter className="flex flex-col py-6 sm:gap-6 gap-4 md:gap-8">
      <Breadcrumb>
        <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex sm:flex-row flex-col-reverse md:w-[60%] gap-4 ">
          <ScrollArea>
            <div className="flex sm:flex-col md:w-28  overflow-x-auto   flex-row gap-2 md:max-h-[600px] md:overflow-y-auto md:overflow-x-hidden">
              {(product.images_by_color
                ? Object.entries(product.images_by_color)
                : []
              ).flatMap(([color, images]) =>
                images.map((img, idx) => (
                  <button
                    key={`${color}-${idx}`}
                    onClick={() => {
                      setSelectedImage(img);
                    }}
                    className={cn(
                      "w-28 h-28 cursor-pointer relative border rounded-lg overflow-hidden",
                      selectedImage === img ? "border-black" : "border-muted"
                    )}
                    onMouseEnter={() => setSelectedImage(img)}
                    title={color}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} - ${color} thumbnail ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {selectedImage && (
            <div className="aspect-square max-h-[800px] w-full bg-gray-100 relative rounded-xl overflow-hidden group">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6  md:w-[40%]">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div>
            <StarRating rating={product.reviews_count ?? 0} />
          </div>

          <div className="text-xl font-semibold">
            {formatMoney(product.price)}
          </div>

          {/* Color Selector */}
          <div className="flex flex-col gap-2 ">
            <span className="font-medium">Color</span>
            <div className="flex gap-4 flex-wrap ">
              {(product.colors ?? []).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color as ColorName)}
                  className={cn(
                    `${
                      COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] ??
                      "bg-gray-200"
                    }`,
                    " border rounded-full cursor-pointer w-8 h-8",
                    selectedColor === color
                      ? `outline-2 outline-offset-2 ${
                          outlineColorClasses[
                            color as keyof typeof outlineColorClasses
                          ]
                        }`
                      : "border-gray-300"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Size</span>
              <p className="text-sm font-medium underline cusror-pointer text-blue-500 underline-offset-2">
                See sizing chart
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {(SIZES ?? []).map((size) => (
                <Button
                  onClick={() => {
                    setSelectedSize(size);
                  }}
                  key={size}
                  disabled={!(product.sizes ?? []).includes(size)}
                  className={cn(
                    "w-20 h-12 border hover:bg-muted font-medium cursor-pointer rounded-md duration-200 text-sm bg-background text-foreground disabled:cursor-not-allowed",
                    selectedSize === size
                      ? "bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-500"
                      : "border-gray-300"
                  )}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex w-full  gap-4 h-12">
            {/* Quantity controls */}
            <div className="flex divide-x  divide-muted items-center border  rounded-md overflow-hidden">
              <button
                onClick={removeQuantity}
                className="w-10 h-full flex items-center justify-center text-xl hover:bg-muted"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-10 h-full flex items-center justify-center text-base">
                {quantity}
              </div>
              <button
                onClick={addQuantity}
                className="w-10 h-full flex items-center justify-center text-xl hover:bg-muted"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to cart button */}
            <Button
              className="flex-1  h-full text-base"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium">Description</span>
            <p className="text-muted-foreground text-sm whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </Gutter>
  );
};
export default ProductDetails;
