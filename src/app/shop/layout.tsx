import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Vyrex Wear",
  description: "Shop number one in algeria",
};

const ShopLayout = async ({ children }: { children: ReactNode }) => {
  return <main>{children}</main>;
};
export default ShopLayout;
