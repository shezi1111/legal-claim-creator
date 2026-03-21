import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atticus — Partner-Level Legal Claims for Everyone",
  description:
    "Democratizing access to justice with AI-powered legal claim creation. Get partner-level legal claims without the partner-level fees.",
  keywords: [
    "legal claims",
    "AI legal",
    "claim creator",
    "legal tech",
    "access to justice",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-text">
        {children}
      </body>
    </html>
  );
}
