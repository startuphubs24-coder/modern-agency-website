import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Startup Hub",
  description: "Websites, marketing, automation, and analytics — everything you need to scale online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Single+Ink:wght@100..900&family=Tektur:wght@400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <div className={`${inter.variable} font-sans`}>
          <LoadingScreen />
          {children}
        </div>
      </body>
    </html>
  );
}
