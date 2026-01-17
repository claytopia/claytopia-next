import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claytopia - Keramik Atelier",
  description: "Keramik-Atelier in Berlin. Clay Club, Brennservice, Workshops und Events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={plusJakartaSans.variable}>
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
