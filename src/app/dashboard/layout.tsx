import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticación en el servidor
  const { userId } = await auth()
  
  // Redirigir si no está autenticado
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header del dashboard */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">Panel de Usuario</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton 
                appearance={{
                  baseTheme: undefined,
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-gray-800 border-gray-700",
                    userButtonPopoverFooter: "bg-gray-800 border-gray-700"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <nav className="w-64 bg-gray-800 min-h-screen p-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                Perfil
              </a>
            </li>
            <li>
              <a href="/dashboard/orders" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                Mis Pedidos
              </a>
            </li>
            <li>
              <a href="/dashboard/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                Configuración
              </a>
            </li>
          </ul>
        </nav>

        {/* Contenido principal */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}