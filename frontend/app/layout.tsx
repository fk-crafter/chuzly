import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chuzly — Plan with your friends. Fast.",
  description:
    "Suggest options, let your friends vote, and just go. No endless group chats.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Chuzly — Plan with your friends. Fast.",
    description:
      "Suggest options, let your friends vote, and just go. No endless group chats.",
    url: "https://chuzly.com",
    siteName: "Chuzly",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Chuzly App Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chuzly — Plan with your friends. Fast.",
    description:
      "Suggest options, let your friends vote, and just go. No endless group chats.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster theme="light" />
      </body>
    </html>
  );
}
