import Navbar from "@/Components/navbar/navbar";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
export const metadata = {
  title: "Budget Tracker",
  description: "A website which make you able to track your budget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body>
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
      </body>
    </html>
  );
}
