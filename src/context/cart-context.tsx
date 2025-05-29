"use client";

import { ColorName } from "@/constant";
import { SelectProduct, Sizes } from "@/db/schema/product";
import React, { createContext, Dispatch, useContext, useState } from "react";

type CartItem = {
  product: SelectProduct;
  quantity: number;
  color: ColorName;
  size: Sizes;
};

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: Dispatch<CartItem[]>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, color: ColorName, size: Sizes) => void;
  handleOpenCart: () => void;
  handleCloseCart: () => void;
  removeAllCart: () => void;
  openCart: boolean;
  setOpenCart: Dispatch<boolean>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState(false);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.product.id === item.product.id &&
          i.color === item.color &&
          i.size === item.size
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: number, color: ColorName, size: Sizes) => {
    if (
      cartItems.find((item) => item.product.id === productId)?.quantity === 1
    ) {
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            item.product.id !== productId ||
            item.color !== color ||
            item.size !== size
        )
      );
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId &&
          item.color === color &&
          item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const removeAllCart = () => {
    setCartItems([]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleOpenCart = () => setOpenCart(true);
  const handleCloseCart = () => setOpenCart(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        clearCart,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        handleOpenCart,
        handleCloseCart,
        openCart,
        setOpenCart,
        removeAllCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
