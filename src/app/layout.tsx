import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'PromptVault — Prompt library for analysts & consultants',
  description: '32+ curated AI prompts for consulting and analytical work.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
