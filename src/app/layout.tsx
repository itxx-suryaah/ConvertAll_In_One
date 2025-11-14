
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import { cn } from "../lib/utils";

const fontBody = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Convert All In One",
  description: "A modern suite of tools for image manipulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Source+Code+Pro:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn("font-body antialiased", fontBody.variable)}
        style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))"}}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
