import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClient from "@/lib/queryClient";
import NextAuthProvider from "@/lib/auth/Provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Stockflow",
  description: "Your personal inventory tracker",
  icons: {
    icon: [
      {
        url: "/assets/logo/logo.svg",
        href: "/assets/logo/logo.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className,
        )}
      >
        <QueryClient>
          <NextAuthProvider>
            <div vaul-drawer-wrapper="" className="bg-background">
              {children}
            </div>
          </NextAuthProvider>
        </QueryClient>

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
