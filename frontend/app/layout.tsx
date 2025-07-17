import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

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
    url: "https://chuzly.app",
    siteName: "Chuzly",
    images: [
      {
        url: "https://chuzly.app/logo.png",
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
    images: ["https://chuzly.app/logo.png"],
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
        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chuzly" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster theme="light" />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
