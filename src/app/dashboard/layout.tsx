import React from "react";
import Sidebar from "@/components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"flex h-screen w-full overflow-hidden"}>
      <Sidebar />
      <div className={"flex-1 py-10 overflow-y-auto"}>{children}</div>
    </div>
  );
};

export default Layout;
