import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "sonner"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Souvenir Stories - Authentic Travel Souvenirs",
  description: "Discover authentic souvenirs from around the world. Bring home memories from your travels.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <CartProvider>
            {children}
            <Toaster richColors />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
