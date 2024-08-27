"use client";

import { QueryClient as q, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const query = new q({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const QueryClient = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={query}>{children}</QueryClientProvider>;
};

export default QueryClient;
