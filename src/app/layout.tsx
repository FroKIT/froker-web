import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Froker — Your Personal Meal Plan',
  description: 'AI-first personalised meal subscription',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Froker',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E8602C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={plusJakarta.className}>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1C1C1C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              padding: '12px 16px',
            },
          }}
        />
      </body>
    </html>
  )
}
