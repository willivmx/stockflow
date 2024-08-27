"use client";
import React from "react";
import { Auth } from "@/lib/auth/utils";
import { useRouter } from "next/navigation";

const PreventUnauthenticatedAccess = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const preventAccess = async () => {
    if (!(await Auth())) {
      return router.push("/auth/signin");
    }
  };

  React.useEffect(() => {
    preventAccess();
  }, []);
  return <>{children}</>;
};

export default PreventUnauthenticatedAccess;
