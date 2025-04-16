import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";

// Configure Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TatakEvent - Uniting Filipinos in Innovation",
  description:
    "Discover and join events that connect Filipinos globally through innovation, culture, and community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <div className="fixed bottom-24 right-7 z-50">
              <ThemeToggle />
            </div>
            <Chatbot />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
