import React from "react";
import Sidebar from "@/components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"flex h-screen w-full"}>
      <Sidebar />
      <div className={"flex-1 py-2 px-20"}>{children}</div>
    </div>
  );
};

export default Layout;
