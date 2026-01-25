import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PromptKing - Craft Perfect AI Prompts',
  description: 'A guided 5-step workflow to create prompts that truly resonate with AI. Stop guessing. Follow a proven framework.',
  keywords: ['AI prompts', 'prompt engineering', 'AI tools', 'prompt builder', 'AI workflow'],
  authors: [{ name: 'PromptKing' }],
  creator: 'PromptKing',
  publisher: 'PromptKing',
  metadataBase: new URL('https://promptking.online'),
  openGraph: {
    title: 'PromptKing - Craft Perfect AI Prompts',
    description: 'A guided 5-step workflow to create prompts that truly resonate with AI',
    type: 'website',
    siteName: 'PromptKing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptKing - Craft Perfect AI Prompts',
    description: 'A guided 5-step workflow to create prompts that truly resonate with AI',
  },
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
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
