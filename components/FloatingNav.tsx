'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (pathname.includes('/admin')) {
    return null
  }

  const sections = [
    { id: 'hero', icon: '🏠', name: 'Inicio' },
    { id: 'categories', icon: '📂', name: 'Categorías' },
    { id: 'products', icon: '💻', name: 'Productos' },
    { id: 'about', icon: 'ℹ️', name: 'Nosotros' },
    { id: 'contact', icon: '📞', name: 'Contacto' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {isVisible && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800 rounded-lg p-2 shadow-xl">
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="w-12 h-12 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white transition-colors duration-200 group relative"
                title={section.name}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="absolute right-full mr-2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {section.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}