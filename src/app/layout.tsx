import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Param | AI Engineer & Founder",
  description: "AI engineer, startup founder, and ML researcher crafting futuristic digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} dark`}>
      <body className="bg-[#030014] text-white min-h-screen font-sans selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  );
}