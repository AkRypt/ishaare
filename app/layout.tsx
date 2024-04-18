import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { constants } from "./constants";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Ishaare",
  description: "Play Heads Up game with your Indian friends",

  metadataBase: new URL("https://ishaaregame.vercel.app"),
  keywords: [
    "ishaare",
    "charades",
    "indian",
    "game",
    "friends",
    "play",
    "heads up"
  ],
  openGraph: {
    siteName: "Ishaare",
    type: "website",
    locale: "en_US"
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow"
  },
  verification: {
    google: "YmyyeXR2N3tf-O0tAaBuiibsZwr7p-gUgmnBKbEU5l0"
  },
  alternates: {
    canonical: constants.siteUrl
  },
  applicationName: "Ishaare",
  appleWebApp: {
    title: "Ishaare",
    statusBarStyle: "default",
    capable: true
  },
  twitter: {
    card: "summary_large_image",
    title: "Ishaare",
    description:
      "Play Indian Charades with your friends",
    creator: "@AkshitDayal8",
    site: "@AkshitDayal8",
    images: [
      {
        url: "https://ishaaregame.vercel.app/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Ishaare"
      }
    ]
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon"
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png"
      }
      // add favicon-32x32.png, favicon-96x96.png, android-chrome-192x192.png
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon"
      }
    ],
    apple: [
      {
        url: "/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png"
      },
      {
        url: "/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png"
      }
      // add apple-icon-72x72.png, apple-icon-76x76.png, apple-icon-114x114.png, apple-icon-120x120.png, apple-icon-144x144.png, apple-icon-152x152.png, apple-icon-180x180.png
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
