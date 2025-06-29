import type React from "react"
import type { Metadata, Viewport } from "next/next"
import { Inter } from "next/font/google"
import "./globals.css"
import PWAInstallPrompt from "../components/PWAInstallPrompt"
import PWAOfflineIndicator from "../components/PWAOfflineIndicator"
import PWAUpdatePrompt from "../components/PWAUpdatePrompt"
import SyncStatusIndicator from "../components/SyncStatusIndicator"
import { ErrorBoundary } from "../components/ui/error-boundary"
import { AuthProvider } from "../hooks/useAuth"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

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
  generator: 'FitTrainer Pro',
  applicationName: "FitTrainer Pro",
  referrer: "origin-when-cross-origin",
  keywords: ["fitness", "personal trainer", "workout", "gym", "health", "exercise", "training"],
  authors: [{ name: "FitTrainer Team" }],
  creator: "FitTrainer Team",
  publisher: "FitTrainer",
  openGraph: {
    title: "FitTrainer Pro",
    description: "Professional personal trainer and student management application",
    url: "https://fittrainer.example.com",
    siteName: "FitTrainer Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FitTrainer Pro - Personal Trainer Management",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitTrainer Pro",
    description: "Professional personal trainer and student management application",
    images: ["/twitter-image.png"],
    creator: "@fittrainerpro"
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "fitness",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" }
  ],
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
        <meta name="apple-mobile-web-app-title" content="FitTrainer Pro" />
        <meta name="application-name" content="FitTrainer Pro" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <PWAOfflineIndicator />
              <PWAInstallPrompt />
              <PWAUpdatePrompt />
              <SyncStatusIndicator />
              {children}
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}