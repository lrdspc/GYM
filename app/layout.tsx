import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import PWAInstallPrompt from "../components/PWAInstallPrompt"
import PWAOfflineIndicator from "../components/PWAOfflineIndicator"
import PWAUpdatePrompt from "../components/PWAUpdatePrompt"
import SyncStatusIndicator from "../components/SyncStatusIndicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitTrainer Pro",
  description: "Personal trainer and student management app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FitTrainer Pro",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1668-2388.png",
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1536-2048.png",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1125-2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1242-2688.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  generator: 'v0.dev',
  applicationName: "FitTrainer Pro",
  referrer: "origin-when-cross-origin",
  keywords: ["fitness", "personal trainer", "workout", "gym", "health"],
  authors: [{ name: "FitTrainer Team" }],
  creator: "FitTrainer Team",
  publisher: "FitTrainer",
  openGraph: {
    title: "FitTrainer Pro",
    description: "Personal trainer and student management app",
    url: "https://fittrainer.example.com",
    siteName: "FitTrainer Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FitTrainer Pro",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitTrainer Pro",
    description: "Personal trainer and student management app",
    images: ["/twitter-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "fitness",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#3b82f6",
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-title" content="FitTrainer Pro" />
        <meta name="application-name" content="FitTrainer Pro" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <PWAOfflineIndicator />
          <PWAInstallPrompt />
          <PWAUpdatePrompt />
          <SyncStatusIndicator />
          {children}
        </div>
      </body>
    </html>
  )
}
