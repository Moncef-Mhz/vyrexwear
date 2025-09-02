import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from "../lib/edgestore";
import { CartProvider } from "@/context/cart-context";
import { AppLayoutClient } from "@/components/global/layout-client";

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vyrex Wear",
  description: "Shop number one in Algeria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <EdgeStoreProvider>
              <AppLayoutClient>{children}</AppLayoutClient>
              <Toaster />
            </EdgeStoreProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
