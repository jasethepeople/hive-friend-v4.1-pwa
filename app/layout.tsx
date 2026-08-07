import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { MobileNav } from '@/components/MobileNav'
import { TouchGestures } from '@/components/TouchGestures'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hive Friend',
  description: 'Planetary Swarm Dashboard',
  manifest: '/manifest.json'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00d9a3',
  viewportFit: 'cover'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <TouchGestures onRefresh={() => window.location.reload()}>
            <MobileNav />
            <main className="lg:pl-16 pt-14 lg:pt-0 min-h-screen pb-safe">
              {children}
            </main>
          </TouchGestures>
        </ThemeProvider>
        <script dangerouslySetInnerHTML={{__html: \`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}\`}} />
      </body>
    </html>
  );
}