"use client";
import React from "react";
import Logo from "@/components/logo";
import {
  GalleryHorizontalEnd,
  Gauge,
  LogOut,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MENU_ITEMS = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    name: "Catégories",
    href: "/dashboard/categories",
    icon: GalleryHorizontalEnd,
  },
  {
    name: "Produits",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Commandes",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
];

const Sidebar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const pathname = usePathname();
  return (
    <div
      className={
        "w-[16em] bg-secondary p-1 flex flex-col justify-between shadow-lg top-0 left-0 sticky"
      }
    >
      <div className={"flex flex-col gap-4"}>
        <div
          className={"inline-flex w-full justify-start items-center gap-2 p-4"}
        >
          <Logo size={40} />
          <span className={"font-black text-3xl"}>Stockflow</span>
        </div>
        <div className={"flex flex-col gap-0.5"}>
          {MENU_ITEMS.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              className={cn(
                buttonVariants({
                  size: "lg",
                }),
                "justify-start gap-2 px-4 text-xs bg-transparent shadow-none text-primary hover:text-primary-foreground",
                pathname === item.href &&
                  "bg-primary text-primary-foreground hover:bg-primary",
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={
              "flex justify-start items-center gap-3 p-1 border-primary border rounded-md overflow-hidden cursor-pointer shadow-2xl bg-background"
            }
          >
            <Avatar>
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className={"bg-primary text-primary-foreground"}>
                {user?.name?.split(" ")[0][0]?.toUpperCase()}
                {user?.name?.split(" ")[1][0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className={
                "flex flex-1 flex-col gap-0.5 justify-start items-start text-xs w-3/4"
              }
            >
              <span className={"font-semibold truncate text-ellipsis w-full"}>
                {user?.name}
              </span>
              <span className={"primary truncate text-ellipsis w-full"}>
                {user?.email}
              </span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(16em-8px)] p-1">
          <Button
            variant={"destructive"}
            className={"w-full text-xs font-semibold gap-2 border-none"}
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Sidebar;
