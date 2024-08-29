import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Logo = ({
  size = 50,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <Link
      href={"/"}
      className="inline-flex items-center justify-center cursor-pointer overflow-hidden rounded-[50px]"
    >
      <Image
        src="/assets/logo/logo.svg"
        alt="Logo"
        width={size}
        height={size}
        className={cn("dark:invert", className)}
      />
    </Link>
  );
};

export default Logo;
