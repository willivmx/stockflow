"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const Page = () => {
  const handleSigninWithGoogle = () => {
    return signIn("google", {
      callbackUrl: "/dashboard",
    });
  };
  return (
    <div className={"flex w-full h-screen p-2"}>
      <div className={"w-1/2 flex flex-col justify-center items-center gap-6"}>
        <span className={"font-black text-3xl"}>Connexion</span>
        <Button
          className={"w-1/2 rounded-full text-xs gap-2"}
          onClick={handleSigninWithGoogle}
        >
          <FcGoogle size={24} />
          <span>Se connecter avec Google</span>
        </Button>
      </div>
      <div
        className={
          "w-1/2 flex flex-col justify-center items-center bg-primary rounded-xl"
        }
      >
        <Image
          src="/assets/logo/logo.svg"
          alt="Logo"
          width={50}
          height={50}
          className={"dark:invert size-1/2 pointer-events-none"}
        />
      </div>
    </div>
  );
};

export default Page;
