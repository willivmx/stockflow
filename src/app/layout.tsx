import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClient from "@/lib/queryClient";
import NextAuthProvider from "@/lib/auth/Provider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <QueryClient>
          <NextAuthProvider>{children}</NextAuthProvider>
        </QueryClient>
      </body>
    </html>
  );
}
