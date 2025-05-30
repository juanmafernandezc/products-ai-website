import './globals.css'
import { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { dark } from '@clerk/themes'; // Asegúrate de importar 'dark' si viene de Clerk

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Rock4Code - Tienda de Portátiles',
  description: 'Los mejores portátiles del mercado para trabajo, gaming, estudios y más. Encuentra el portátil perfecto para cada necesidad y presupuesto.',
  keywords: 'portátiles, laptops, gaming, trabajo, estudiantes, Apple, ASUS, Lenovo, Dell',
  openGraph: {
    title: 'Rock4Code - Tienda de Portátiles',
    description: 'Los mejores portátiles del mercado para trabajo, gaming, estudios y más.',
    type: 'website',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark, // Asumiendo que 'dark' se importa de @clerk/themes
        variables: {
          colorPrimary: "#4f46e5",
          colorText: "#ffffff",
          colorBackground: "#0f172a", // un azul oscuro (slate-900)
          borderRadius: "0.5rem",
          left: "1rem",
        },
      }}
    >
      <html lang="es">
        {/* Aquí combinamos las clases de cuerpo de ambas versiones.
            La segunda versión tenía 'bg-gray-900 text-white',
            la primera tenía `${geistSans.variable} ${geistMono.variable} bg-black text-gray-100 min-h-screen antialiased`.
            Podemos combinar y ajustar según lo desees. */}
        <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-900 text-white min-h-screen antialiased`}>
          {/* Mantenemos el encabezado de la primera versión si es lo que deseas */}
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}