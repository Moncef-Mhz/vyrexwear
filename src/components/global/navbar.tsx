import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

const AppNavBar = () => {
  return (
    <header className="w-full h-16 relative bg-background border-b flex items-center justify-between px-12">
      <ul className="flex items-center z-10 gap-4 text-base">
        <li className="cursor-pointer">
          <Link href={"/shop"}>Shop</Link>
        </li>
        <li className="cursor-pointer">
          <Link href={"/shop/category?gender=men"}>Men</Link>
        </li>
        <li className="cursor-pointer">
          <Link href={"/shop/category?gender=men"}>Women</Link>
        </li>
        <li className="cursor-pointer">
          <Link href={"/shop/collections"}>Collections</Link>
        </li>
      </ul>
      <div className="absolute z-0 left-0 top-0 w-full h-full flex items-center justify-center">
        <h1 className="text-xl   font-bold uppercase tracking-wider">
          <Link href={"/shop"}>Vyrex</Link>
        </h1>
      </div>
      <div className="flex z-10 items-center gap-4">
        <Search className="w-5 h-5 cursor-pointer" strokeWidth={1} />
        <ShoppingBag className="w-5 h-5 cursor-pointer" strokeWidth={1} />
        <User className="w-5 h-5 cursor-pointer" strokeWidth={1} />
      </div>
    </header>
  );
};
export default AppNavBar;
