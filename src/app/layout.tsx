import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Relic.",
  description:
    "Relic is an online fashion store where u can buy all ur favorite fashion wears",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the current path is an auth route
  const isAuthPage = (children as any)?.props?.childPropSegment === "auth";

  return (
    <html lang="en" className={`${jakarta.variable}`}>
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-grow">
          <main className="relative">{children}</main>
        </div>
        {!isAuthPage && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
