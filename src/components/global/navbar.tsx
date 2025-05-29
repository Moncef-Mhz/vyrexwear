"use client";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { Gutter } from "./Gutter";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import CartSideBar from "./cart";

const AppNavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const { handleOpenCart, totalItems } = useCart();

  const handleCloseMenu = () => setOpenMenu(false);
  const handleOpenMenu = () => setOpenMenu(true);

  return (
    <>
      <Gutter className="w-full h-16 relative bg-background border-b flex items-center justify-between ">
        <ul className="md:flex hidden items-center z-10 gap-6 font-medium text-sm">
          <li className="cursor-pointer">
            <Link href={"/shop/categories?gender=men"}>Men</Link>
          </li>
          <li className="cursor-pointer">
            <Link href={"/shop/categories?gender=men"}>Women</Link>
          </li>
          <li className="cursor-pointer">
            <Link href={"/shop/categories"}>Categories</Link>
          </li>
          <li className="cursor-pointer">
            <Link href={"/shop/collections"}>Collections</Link>
          </li>
        </ul>

        <div className="block md:hidden z-10" onClick={handleOpenMenu}>
          <Menu />
        </div>

        <div className="absolute z-0 left-0 top-0 w-full h-full flex items-center justify-center">
          <h1 className="text-xl   font-bold uppercase tracking-wider">
            <Link href={"/shop"}>Vyrex</Link>
          </h1>
        </div>
        <div className="flex z-10 items-center gap-4">
          <Search
            className="w-5 h-5 cursor-pointer hidden md:block"
            strokeWidth={1}
          />
          <div onClick={handleOpenCart} className="relative">
            <div className="absolute text-xs text-center -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white">
              {totalItems > 9 ? 9 : totalItems}
            </div>
            <ShoppingBag className="w-5 h-5 cursor-pointer" strokeWidth={1} />
          </div>
          <User className="w-5 h-5 cursor-pointer" strokeWidth={1} />
        </div>
      </Gutter>

      {openMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={handleCloseMenu}
          />
        </>
      )}

      {/* Sidebar Menu */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-md transform transition-transform duration-300",
          openMenu ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-semibold">Vyrex</h2>
          <button onClick={handleCloseMenu}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Links */}
        <ul className="flex flex-col gap-4 p-4 text-base">
          <li>
            <Link href="/shop/categories?gender=men" onClick={handleCloseMenu}>
              Men
            </Link>
          </li>
          <li>
            <Link
              href="/shop/categories?gender=women"
              onClick={handleCloseMenu}
            >
              Women
            </Link>
          </li>
          <li>
            <Link href="/shop/categories" onClick={handleCloseMenu}>
              Categories
            </Link>
          </li>
          <li>
            <Link href="/shop/collections" onClick={handleCloseMenu}>
              Collections
            </Link>
          </li>
          <li>
            <Link href="/account" onClick={handleCloseMenu}>
              Account
            </Link>
          </li>
          <li>
            <Link href="/cart" onClick={handleCloseMenu}>
              Cart
            </Link>
          </li>
        </ul>
      </aside>
      <CartSideBar />
    </>
  );
};
export default AppNavBar;
