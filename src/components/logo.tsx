import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = ({ size = 50 }: { size?: number }) => {
  return (
    <Link
      href={"/"}
      className="inline-flex items-center justify-center cursor-pointer"
    >
      <Image
        src="/assets/logo/logo.svg"
        alt="Logo"
        width={size}
        height={size}
        className={"dark:invert"}
      />
    </Link>
  );
};

export default Logo;
