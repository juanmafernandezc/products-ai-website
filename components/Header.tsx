'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false)
  }

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    closeMobileMenu()
  }

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="ml-3 text-xl font-bold text-white">Rock4Code</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('productos')} 
              className="nav-link text-gray-400"
            >
              Productos
            </button>
            <button 
              onClick={() => scrollToSection('categorias')} 
              className="nav-link text-gray-400"
            >
              Categorías
            </button>
            <button 
              onClick={() => scrollToSection('nosotros')} 
              className="nav-link text-gray-400"
            >
              Nosotros
            </button>
            <button 
              onClick={() => scrollToSection('contacto')} 
              className="nav-link text-gray-400"
            >
              Contacto
            </button>
            <button 
              onClick={() => scrollToSection('productos')}
              className="btn-primary px-6 py-2 rounded-lg text-white font-medium"
            >
              Ver Catálogo
            </button>
          </div>

          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden mobile-menu ${isMobileMenuOpen ? '' : 'hidden'}`}>
          <div className="px-2 pt-4 pb-6 space-y-4">
            <button 
              onClick={() => scrollToSection('productos')} 
              className="block text-gray-400 hover:text-white py-2 w-full text-left"
            >
              Productos
            </button>
            <button 
              onClick={() => scrollToSection('categorias')} 
              className="block text-gray-400 hover:text-white py-2 w-full text-left"
            >
              Categorías
            </button>
            <button 
              onClick={() => scrollToSection('nosotros')} 
              className="block text-gray-400 hover:text-white py-2 w-full text-left"
            >
              Nosotros
            </button>
            <button 
              onClick={() => scrollToSection('contacto')} 
              className="block text-gray-400 hover:text-white py-2 w-full text-left"
            >
              Contacto
            </button>
            <button 
              onClick={() => scrollToSection('productos')}
              className="btn-primary w-full px-6 py-2 rounded-lg text-white font-medium mt-4"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}