import Navbar from "@/components/navbar/navbar";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "@/components/Providers/ReactQueryProvider";
// import { QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export const metadata = {
  title: "Budget Tracker",
  description: "A website which make you able to track your budget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body>
        <ReactQueryProvider>
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* <Navbar /> */}
              {children}
            </ThemeProvider>
          </ClerkProvider>
        </ReactQueryProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider> */}
      </body>
    </html>
  );
}
