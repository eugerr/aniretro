import type { Metadata, Viewport } from 'next'
import { Pixelify_Sans } from 'next/font/google'

import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ui/theme-provider'
import Footer from '@/components/Footer'

import './globals.css'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: siteConfig.name,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary',
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

const font = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={font.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className='mb-20 px-2 sm:px-4 md:px-6 min-h-screen'>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
