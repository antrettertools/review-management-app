import { SessionProvider } from 'next-auth/react'
import './globals.css'

export const metadata = {
  title: 'ReviewInzight - Manage Customer Reviews in One Place',
  description: 'Centralize reviews from all platforms, get AI-powered response suggestions, and track your reputation in one intuitive dashboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}