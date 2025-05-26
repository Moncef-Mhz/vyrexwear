import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from "../lib/edgestore";

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Vyrex Wear",
  description: "Shop number one in algeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
