'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

export default function Hero() {
  const { isSignedIn, user } = useUser()
  const [showError, setShowError] = useState(false)

  const scrollToProducts = (): void => {
    const element = document.getElementById('productos')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleAgregarProducto = () => {
    if (!isSignedIn) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000) // Ocultar error después de 3 segundos
      return
    }
    // Si está autenticado, navegar a la página (esto se maneja automáticamente por el Link)
  }

  return (
    <section className="hero-bg py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
          Los Mejores
          <span className="block text-gray-300">Portátiles del Mercado</span>
        </h1>
        <p className="text-xl lg:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto">
          Encuentra el portátil perfecto para trabajo, gaming, estudios y más
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={scrollToProducts}
            className="btn-primary px-8 py-4 rounded-lg text-white font-semibold text-lg"
          >
            Ver Productos
          </button>
          
          {isSignedIn ? (
            <Link 
              href="/admin/agregar-producto"
              className="btn-secondary px-8 py-4 rounded-lg text-white font-semibold text-lg inline-block"
            >
              Agregar Producto
            </Link>
          ) : (
            <button
              onClick={handleAgregarProducto}
              className="btn-secondary px-8 py-4 rounded-lg text-white font-semibold text-lg"
            >
              Agregar Producto
            </button>
          )}
        </div>
        
        {showError && (
          <div className="mt-4 p-4 bg-red-500 text-white rounded-lg max-w-md mx-auto">
            <p className="font-semibold">❌ Error de acceso</p>
            <p>Debes iniciar sesión para agregar productos.</p>
          </div>
        )}
      </div>
    </section>
  )
}