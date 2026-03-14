import type { Metadata } from "next";
import { Inter, Tektur } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Digital Growth Agency",
  description: "Websites, marketing, automation, and analytics — everything you need to scale online.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Single+Ink:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${tektur.variable} font-sans antialiased bg-white`}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
