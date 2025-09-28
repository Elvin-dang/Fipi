import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { GlobalStoreProvider } from "@/providers/globalStateProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/themeProvider";
import { DrawerCSSProvider } from "@/providers/drawerCSSProvider";
import { SettingStoreProvider } from "@/providers/settingStoreProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TouchProvider } from "@/components/HybridTooltip";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { v4 } from "uuid";
import { admin } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

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
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Fipi",
    "File pipe",
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
    default: "Fipi - File Pipe",
    template: `%s | Fipi`,
  },
  verification: {
    google: "Pl_x0DNj37QqNY2z7TYLAoZRTSPv_ay0qgFIXqZ7X7A",
  },
  description:
    "Fast, secure, and private peer-to-peer file-sharing platform. No sign-ups, no cloud storage — just instant file transfers directly between devices using WebRTC.",
  applicationName: "Fipi",
  appleWebApp: {
    title: "Fipi",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    title: "Fipi - File Pipe",
    description:
      "Fast, secure, and private peer-to-peer file-sharing platform. No sign-ups, no cloud storage — just instant file transfers directly between devices using WebRTC.",
    siteName: "Fipi",
    url: "https://fipi.live",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://fipi.live/og-image.png?v=1740389826528",
        width: 1200,
        height: 630,
        alt: "Fipi",
      },
    ],
  },
  twitter: {
    card: "summary",
  },
  icons: {
    icon: [
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
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon-144x144.png",
        sizes: "144x144",
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
    apple: [
      {
        url: "/apple-touch-icon-76x76.png",
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const uid = v4();
  const token = await admin.auth().createCustomToken(uid, { id: uid });
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip");

  // @ts-expect-error ip always exists
  const roomId = crypto.createHmac("md5", process.env.SECRET).update(ip).digest("hex");

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
                <GlobalStoreProvider data={{ id: uid, token, roomId }}>
                  <SettingStoreProvider>{children}</SettingStoreProvider>
                </GlobalStoreProvider>
              </TouchProvider>
            </TooltipProvider>
          </DrawerCSSProvider>
          <Toaster
            offset={{ bottom: "60px" }}
            mobileOffset={{ bottom: "60px" }}
            expand
            duration={8000}
          />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
