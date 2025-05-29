import './globals.css'
import { Metadata } from 'next'

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
    <html lang="es">
      <body className="bg-black text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}