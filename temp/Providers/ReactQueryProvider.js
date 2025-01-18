"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { QueryClientProvider, QueryClient } from "react-query";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "../ui/sonner";
function ReactQueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2, // Number of retries for failed queries
            staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
          },
        },
      })
  );
  console.log(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="bottom-right" />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default ReactQueryProvider;
