"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { useScrollToAnchor } from "../src/app/hooks/useNavigations"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const { navigateToSection } = useScrollToAnchor()

  const navigationItems = [
    { name: "Inicio", path: "/", section: "hero" },
    { name: "Categorías", path: "/", section: "categories" },
    { name: "Productos", path: "/", section: "products" },
    { name: "Nosotros", path: "/", section: "about" },
    { name: "Contacto", path: "/", section: "contact" },
  ]

  const handleNavigation = (path: string, section?: string) => {
    setIsMenuOpen(false)
    navigateToSection(path, section)
  }

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavigation("/", "hero")}>
            <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="ml-3 text-xl font-bold text-white">Rock4Code</span>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path, item.section)}
                className={`text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.path ? "text-blue-400" : ""
                }`}
              >
                {item.name}
              </button>
            ))}

            {/* Botón Admin */}
            {isSignedIn && (
              <button
                onClick={() => {
                  router.push("/admin/agregar-producto")
                }}
                className={`text-gray-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                  pathname.includes("/admin") ? "text-yellow-400" : ""
                }`}
                title="Gestionar Productos"
              >
                ➕ Agregar Producto
              </button>
            )}

            {/* UserButton de Clerk posicionado después de Agregar Producto */}
            {isSignedIn && (
              <div className="flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-gray-800 border-gray-600",
                      userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700",
                    },
                  }}
                />
              </div>
            )}
          </nav>

          {/* Autenticación para usuarios no logueados */}
          <div className="flex items-center space-x-4">
            {!isSignedIn && (
              <SignInButton>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                  Iniciar Sesión
                </button>
              </SignInButton>
            )}

            {/* Botón menú móvil */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-300 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path, item.section)}
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 text-left text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              {isSignedIn && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    router.push("/admin/agregar-producto")
                  }}
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-left text-sm font-medium transition-colors duration-200"
                >
                  🛠️ Administrar
                </button>
              )}
              {/* UserButton en móvil */}
              {isSignedIn && (
                <div className="px-3 py-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "bg-gray-800 border-gray-600",
                        userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700",
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
