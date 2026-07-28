import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import LenisProvider from "@/components/providers/LenisProvider"
import ThemeProvider from "@/components/providers/ThemeProvider"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { getAllProducts } from "@/data/products"
import { SearchProvider } from "@/components/search/SearchProvider"
import SearchModal from "@/components/search/SearchModal"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://geetai.com"),
  title: "GeetAI Template Engine",
  description: "Ship production-ready apps at lightning speed with our premium template engine.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const products = getAllProducts()

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-hero-bg font-sans text-white selection:bg-[#6c5ce7]/30">
        <ThemeProvider>
          <LenisProvider>
            <SearchProvider products={products}>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <SearchModal />
            </SearchProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
