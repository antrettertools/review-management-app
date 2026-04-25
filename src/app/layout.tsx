import './globals.css'
import type { Metadata, Viewport } from 'next'
import Providers from './providers'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reviewinzight.com'
const OG_IMAGE = `${SITE_URL}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ReviewInzight — One inbox for all your customer reviews',
    template: '%s · ReviewInzight',
  },
  description:
    'Centralize Google, Facebook & more in one dashboard. Reply in seconds with AI-drafted responses, track sentiment, and protect your reputation. 14-day free trial.',
  keywords: [
    'review management',
    'review reply automation',
    'AI review responses',
    'Google review responder',
    'reputation management',
    'customer reviews dashboard',
    'small business review tool',
  ],
  authors: [{ name: 'ReviewInzight' }],
  applicationName: 'ReviewInzight',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'ReviewInzight',
    title: 'ReviewInzight — One inbox for all your customer reviews',
    description:
      'See every review in one place. Reply in seconds with AI. Track your reputation. 14-day free trial.',
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'ReviewInzight — Manage all your reviews from one inbox',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReviewInzight — One inbox for all your customer reviews',
    description:
      'See every review in one place. Reply in seconds with AI. Track your reputation.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* 100% privacy-first analytics */}
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
