"use client";

import { usePathname } from "next/navigation";
import AppNavBar from "@/components/global/navbar";
import { Footer } from "./footer";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar on all routes starting with /admin
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <AppNavBar />}
      <main>{children}</main>
      {!isAdminPage && <Footer />}
    </>
  );
}
