"use client";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  User,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { Gutter } from "./Gutter";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import CartSideBar from "./cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/shop/categories" },
  { name: "Collections", href: "/shop/collections" },
];

const AppNavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const { data: session } = authClient.useSession();
  const router = useRouter();

  const { handleOpenCart, totalItems } = useCart();

  const handleCloseMenu = () => setOpenMenu(false);
  const handleOpenMenu = () => setOpenMenu(true);

  return (
    <>
      {session?.user.role === "admin" && (
        <Gutter className="w-full h-10 relative bg-background border-b flex items-center justify-between ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-10 space-x-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Administrator</span>
              <span className="text-blue-200">•</span>
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-blue-200 transition-colors underline underline-offset-2"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </Gutter>
      )}
      <Gutter className="w-full h-16 relative bg-background  flex items-center justify-between ">
        <ul className="md:flex hidden items-center z-10 gap-6 ">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="hover:text-primary transition-colors font-normal text-base"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="block md:hidden z-10" onClick={handleOpenMenu}>
          <Menu />
        </div>

        <div className="absolute z-0 left-0 top-0 w-full h-full flex items-center justify-center">
          <Link href={"/"}>
            <Image
              src="/assets/vyrexlogo.svg"
              alt="vyrex"
              width={100}
              height={100}
              className="size-24 object-contain dark:hidden"
            />
            <Image
              src="/assets/vyrexlogodark.svg"
              alt="vyrex"
              width={100}
              height={100}
              className="size-24 object-contain hidden dark:block"
            />
          </Link>
        </div>
        <div className="flex z-10 items-center gap-4">
          <Search
            className="w-5 h-5 cursor-pointer hidden md:block"
            strokeWidth={1}
          />
          <div onClick={handleOpenCart} className="relative">
            {totalItems > 0 && (
              <div className="absolute text-xs text-center -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white">
                {totalItems > 9 ? 9 : totalItems}
              </div>
            )}
            <ShoppingBag className="w-5 h-5 cursor-pointer" strokeWidth={1} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:block">
              <div className="relative">
                <User className="w-5 h-5 cursor-pointer" strokeWidth={1} />
                <span className="sr-only">Open user menu</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {!session && (
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/login" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {session && (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  {session.user.role == "admin" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Cart</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={() => authClient.signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
          "fixed top-0 left-0 z-50 h-full w-64 bg-white text-muted shadow-md transform transition-transform duration-300",
          openMenu ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between px-4  border-b">
          <Link href={"/"}>
            <Image
              src="/assets/vyrexlogo.svg"
              alt="vyrex"
              width={100}
              height={100}
              className="size-16 object-contain dark:block"
            />
            <Image
              src="/assets/vyrexlogodark.svg"
              alt="vyrex"
              width={100}
              height={100}
              className="size-16 object-contain hidden dark:hidden"
            />
          </Link>
          <button onClick={handleCloseMenu}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Links */}
        <ul className="flex flex-col  gap-4 p-4 text-base">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="hover:text-primary  transition-colors font-normal text-base"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/account" onClick={handleCloseMenu}>
              Account
            </Link>
          </li>
        </ul>
      </aside>
      <CartSideBar />
    </>
  );
};
export default AppNavBar;
