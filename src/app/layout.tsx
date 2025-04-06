import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Da Kun Time - Time Zone Converter",
  description: "Compare time zones between different cities easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
