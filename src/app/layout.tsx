import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { GlobalStoreProvider } from "@/providers/globalStateProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/themeProvider";
import { DrawerCSSProvider } from "@/providers/drawerCSSProvider";
import { SettingStoreProvider } from "@/providers/settingStoreProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TouchProvider } from "@/components/HybridTooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fipi.live"),
  openGraph: {
    title: "Fipi | File Pile - P2P File Sharing",
    description:
      "Fipi is a seamless peer-to-peer file-sharing platform that allows users to transfer files instantly.",
    siteName: "Fipi | File Pile",
    url: "https://fipi.live",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://fipi.live/og-image.jpg", // Replace with an actual OG image URL
        width: 1200,
        height: 630,
        alt: "Fipi | Secure P2P File Sharing",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://fipi.live/rss.xml",
    },
  },
  applicationName: "Fipi | File Pile",
  appleWebApp: {
    title: "Fipi | File Pile",
    statusBarStyle: "default",
    capable: true,
  },
  verification: {
    google: "YOUR_DATA",
    yandex: ["YOUR_DATA"],
    other: {
      "msvalidate.01": ["YOUR_DATA"],
      "facebook-domain-verification": ["YOUR_DATA"],
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      // add favicon-32x32.png, favicon-96x96.png, android-chrome-192x192.png
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      // add apple-icon-72x72.png, apple-icon-76x76.png, apple-icon-114x114.png, apple-icon-120x120.png, apple-icon-144x144.png, apple-icon-152x152.png, apple-icon-180x180.png
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DrawerCSSProvider>
            <TooltipProvider delayDuration={200}>
              <TouchProvider>
                <GlobalStoreProvider>
                  <SettingStoreProvider>{children}</SettingStoreProvider>
                </GlobalStoreProvider>
              </TouchProvider>
            </TooltipProvider>
          </DrawerCSSProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
