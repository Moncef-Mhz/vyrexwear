"use client";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { useRouter } from "next/navigation";

const CartSideBar = () => {
  const {
    openCart,
    setOpenCart,
    totalItems,
    totalPrice,
    cartItems,
    handleCloseCart,
    removeFromCart,
  } = useCart();

  const router = useRouter();

  const handleCheckOut = () => {
    router.push("/shop/checkout");
    setOpenCart(false);
  };

  return (
    <Sheet open={openCart} onOpenChange={setOpenCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <div className="flex-1  overflow-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some items to get started!
              </p>
              <Button onClick={handleCloseCart}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 border rounded-lg">
                  <div className="relative h-22 w-20 flex-shrink-0">
                    <Image
                      src={
                        item.product.images_by_color
                          ? item.product.images_by_color?.[item.color]?.[1]
                          : ""
                      }
                      alt={item.product.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">
                          {item.product.title}{" "}
                          {item.quantity > 1 ? `(${item.quantity})` : ""}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.color} • {item.size}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          removeFromCart(item.product.id, item.color, item.size)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div />
                      <div className="text-right">
                        <p className="font-medium">
                          {formatMoney(item.product.price * item.quantity)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatMoney(item.product.price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t mb-4 pt-4 px-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatMoney(totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={handleCheckOut}>
                Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCloseCart}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default CartSideBar;
