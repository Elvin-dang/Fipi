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
import Footer from "./_components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  keywords: [
    "Fipi",
    "File pile",
    "P2P file sharing",
    "Send files online",
    "Fast file transfer",
    "Secure file sharing",
    "Web-based file transfer",
    "Free file-sharing website",
    "Best peer-to-peer file-sharing site",
    "Send large files without login",
    "No sign-up file transfer",
    "Fastest way to share files online",
    "Alternative to Sharedrop",
    "Private and secure file sharing",
    "WebRTC file transfer",
    "Serverless file sharing",
    "Encrypted peer-to-peer sharing",
    "Open-source file transfer website",
    "Direct browser-to-browser file sharing",
  ],
  title: {
    default: "Fipi",
    template: `%s | Fipi`,
  },
  verification: {
    google: "Pl_x0DNj37QqNY2z7TYLAoZRTSPv_ay0qgFIXqZ7X7A",
  },
  description:
    "Fast, secure, and private peer-to-peer file-sharing platform. No sign-ups, no cloud storage — just instant file transfers directly between devices using WebRTC.",
  applicationName: "Fipi | P2P File Sharing",
  appleWebApp: {
    title: "Fipi",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    title: "Fipi",
    description:
      "Fast, secure, and private peer-to-peer file-sharing platform. No sign-ups, no cloud storage — just instant file transfers directly between devices using WebRTC.",
    siteName: "Fipi - P2P File Sharing",
    url: "https://fipi.live",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://fipi.live/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fipi",
      },
    ],
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
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon-57x57.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },

      {
        url: "/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fipi",
  url: "https://fipi.live",
  description:
    "Fast, secure, and private peer-to-peer file-sharing platform. No sign-ups, no cloud storage — just instant file transfers directly between devices using WebRTC.",
  applicationCategory: "File Transfer",
  operatingSystem: "Web",
  browserRequirements: ["requires HTML5 support", "requires JavaScript"],
  image: "https://fipi.live/logo.png",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh`}
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
            <Footer />
          </DrawerCSSProvider>
        </ThemeProvider>
        <Toaster offset={{ bottom: "60px" }} mobileOffset={{ bottom: "60px" }} />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
