"use client";
import { createOrder } from "@/app/actions/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { COLOR_CLASSES, ColorName, shippingCosts, wilayas } from "@/constant";
import { useCart } from "@/context/cart-context";
import {
  insertOrderSchema,
  NewOrder,
  SimplifiedCartItem,
} from "@/db/schema/orders";
import { SelectProduct, Sizes } from "@/db/schema/product";
import { cn, formatMoney } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CheckOutPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState<
    (typeof wilayas)[number] | null
  >(null);

  const onValueChange = (value: string) => {
    const wilaya = wilayas.find((w) => w.name === value);
    if (wilaya) {
      setSelectedWilaya(wilaya);
    }
  };

  const { cartItems, totalPrice, addOneToCart, removeFromCart } = useCart();

  const form = useForm<NewOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      userInfo: {
        firstName: "",
        lastName: "",
        phoneNumber1: "",
        phoneNumber2: "",
        address: "",
        commune: "",
        wilaya: "",
        shippingMethod: "stopdesk",
      },
      items: [],
      status: "pending",
      totalPrice: 0,
      totalQuantity: 0,
      shippingCosts: 0,
    },
  });

  const { handleSubmit, watch } = form;

  const shippingMethod = watch("userInfo.shippingMethod");

  console.log(form.formState.errors);

  useEffect(() => {
    // Update form default values when cartItems change
    form.reset({
      ...form.getValues(),
      items: cartItems,
    });
  }, [cartItems, form]);

  function calculateSubtotal(item: {
    product: SelectProduct;
    quantity: number;
    color: ColorName;
    size: Sizes;
  }): number {
    return item.product.price * item.quantity;
  }

  const getShippongCost = (wilaya: string) => {
    const found = shippingCosts.find((item) => item.wilaya === wilaya);

    if (!found) return "N/A";
    return found[shippingMethod];
  };

  const onSubmit = (data: NewOrder) => {
    const simplifiedItems: SimplifiedCartItem[] = cartItems.map((item) => ({
      productId: Number(item.product.id),
      title: item.product.title ?? "",
      price: Number(item.product.price ?? 0),
      quantity: item.quantity ?? 1,
      color: item.color,
      size: item.size,
      image: item.product.images_by_color?.[item.color]?.[1] ?? "",
    }));

    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Ensure shippingCosts is a number or null
    const shippingCostValue = getShippongCost(selectedWilaya?.name ?? "");
    const finalData = {
      ...data,
      items: simplifiedItems,
      totalPrice,
      totalQuantity,
      shippingCosts:
        typeof shippingCostValue === "number" ? shippingCostValue : 0,
    };

    try {
      createOrder(finalData);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div className=" divide-x grid grid-cols-3  min-h-screen w-full">
      <div className="col-span-2 w-full flex flex-col gap-4 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Your cart is empty</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden border rounded-sm md:block">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-left  font-medium">
                      Product
                    </TableHead>
                    <TableHead className="text-left  font-medium">
                      Color
                    </TableHead>
                    <TableHead className="text-left  font-medium">
                      Size
                    </TableHead>
                    <TableHead className="text-left  font-medium">
                      Quantity
                    </TableHead>
                    <TableHead className="text-right  font-medium">
                      Total
                    </TableHead>
                    <TableHead className="w-12 "></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow
                      key={`${item.product.id}-${item.color}-${item.size}`}
                      className="border-b last:border-b-0"
                    >
                      <TableCell className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              item.product.images_by_color
                                ? item.product.images_by_color?.[
                                    item.color
                                  ]?.[1]
                                : ""
                            }
                            width={64}
                            height={64}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="font-medium line-clamp-2">
                              {item.product.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div
                          className={cn(
                            `${
                              COLOR_CLASSES[
                                item.color as keyof typeof COLOR_CLASSES
                              ] ?? "bg-gray-200"
                            }`,
                            "border rounded-full cursor-pointer w-6 h-6"
                          )}
                        ></div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge variant="outline">{item.size}</Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.color,
                                item.size
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              addOneToCart(
                                item.product.id,
                                item.color,
                                item.size
                              )
                            }
                            disabled={
                              item.quantity >= (item.product.stock ?? 0)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="p-4 text-right font-medium">
                        {formatMoney(calculateSubtotal(item))}
                      </TableCell>
                      <TableCell className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.color,
                              item.size
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            {/* <div className="md:hidden space-y-4">
              {items.map((item, index) => (
                <Card key={`${item.product.id}-${item.color}-${item.size}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={getProductImage(item) || "/placeholder.svg"}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium line-clamp-2">
                            {item.product.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                            onClick={() => onRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {item.color}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                onUpdateQuantity(
                                  index,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                onUpdateQuantity(index, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.product.price)} each
                            </p>
                            <p className="font-medium">
                              {formatPrice(calculateSubtotal(item))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div> */}
          </>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-span-1 sticky top-0 py-6 px-10  flex flex-col bg-muted h-screen w-full"
        >
          <h1 className="text-xl font-semibold">Shipping Details</h1>
          <div className=" flex flex-col gap-4 mt-6 overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-4 ">
              <FormField
                control={form.control}
                name="userInfo.firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Input
                      {...field}
                      placeholder="First Name"
                      className="input w-full "
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userInfo.lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Input
                      {...field}
                      placeholder="Last Name"
                      className="input w-full "
                    />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="userInfo.phoneNumber1"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <Button
                      className="shrink-0 rounded-l-sm rounded-r-none z-10 inline-flex  h-10 items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                      type="button"
                      variant={"outline"}
                    >
                      <svg
                        width="28px"
                        height="28px"
                        viewBox="0 0 36 36"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        preserveAspectRatio="xMidYMid meet"
                        fill="#000000"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <g id="SVGRepo_iconCarrier">
                          <path
                            fill="#006233"
                            d="M4 5a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h14V5H4z"
                          />

                          <path
                            fill="#EEE"
                            d="M32 5H18v26h14a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
                          />

                          <path
                            fill="#D20F34"
                            d="M20 24c-3.315 0-6-2.685-6-6c0-3.314 2.685-6 6-6c1.31 0 2.52.425 3.507 1.138A7.332 7.332 0 0 0 18 10.647A7.353 7.353 0 0 0 10.647 18A7.353 7.353 0 0 0 18 25.354c2.195 0 4.16-.967 5.507-2.492A5.963 5.963 0 0 1 20 24z"
                          />

                          <path
                            fill="#D20F34"
                            d="M25.302 18.23l-2.44.562l-.22 2.493l-1.288-2.146l-2.44.561l1.644-1.888l-1.287-2.147l2.303.98l1.644-1.889l-.22 2.494z"
                          />
                        </g>
                      </svg>
                      <span className="ml-1">+213</span>
                    </Button>

                    <div className="relative w-full">
                      <Input
                        type="phone"
                        {...field}
                        id="phone-input"
                        className="block  w-full  h-10 border-l-0 rounded-l-none "
                        placeholder="792948542"
                      />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userInfo.wilaya"
              render={({ field }) => (
                <FormItem>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedWilaya
                          ? `${selectedWilaya.code} - ${selectedWilaya.name}`
                          : "Wilaya"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search wilaya..." />
                        <CommandList>
                          <CommandEmpty>No wilaya found.</CommandEmpty>
                          <CommandGroup>
                            {wilayas.map((wilaya) => (
                              <CommandItem
                                key={wilaya.id}
                                value={`${wilaya.code} ${wilaya.name}`}
                                onSelect={() => {
                                  onValueChange?.(wilaya.name);
                                  field.onChange(wilaya.name);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedWilaya?.name === wilaya.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {wilaya.code} - {wilaya.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userInfo.commune"
              render={({ field }) => (
                <FormItem>
                  <Input
                    {...field}
                    placeholder="City"
                    className="input w-full "
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userInfo.address"
              render={({ field }) => (
                <FormItem>
                  <Input
                    {...field}
                    placeholder="Address"
                    className="input w-full "
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userInfo.shippingMethod"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stopdesk">Stopdesk</SelectItem>
                      <SelectItem value="domicile">Domicile</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between my-4">
              <h2 className="text-sm font-medium">Sub Total</h2>
              <span className="text-sm text-muted-foreground">
                {totalPrice} DA
              </span>
            </div>
            <div className="flex items-center justify-between my-4">
              <h2 className="text-sm font-medium">Shipping</h2>
              <span className="text-sm text-muted-foreground">
                {getShippongCost(selectedWilaya?.name ?? "")} DA
              </span>
            </div>
            <div className="flex items-center justify-between my-4">
              <h2 className="text-base font-semibold">Total</h2>
              <span className="text-sm text-muted-foreground">
                {getShippongCost(selectedWilaya?.name ?? "") !== "N/A"
                  ? totalPrice +
                    Number(getShippongCost(selectedWilaya?.name ?? ""))
                  : totalPrice}{" "}
                DA
              </span>
            </div>
            <Button className="w-full">Order Now</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CheckOutPage;
