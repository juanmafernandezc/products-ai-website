import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Geist, Geist_Mono } from "next/font/google"
import { dark } from "@clerk/themes"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Rock4Code - Tienda de Portátiles",
  description:
    "Los mejores portátiles del mercado para trabajo, gaming, estudios y más. Encuentra el portátil perfecto para cada necesidad y presupuesto.",
  keywords: "portátiles, laptops, gaming, trabajo, estudiantes, Apple, ASUS, Lenovo, Dell",
  openGraph: {
    title: "Rock4Code - Tienda de Portátiles",
    description: "Los mejores portátiles del mercado para trabajo, gaming, estudios y más.",
    type: "website",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#4f46e5",
          colorText: "#ffffff",
          colorBackground: "#0f172a",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html lang="es" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-900 text-white min-h-screen antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
