"use client";
import React from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Page;
