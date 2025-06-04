import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Verificar autenticación
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Obtener información del usuario
  const user = await currentUser()

  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          ¡Bienvenido, {user?.firstName || 'Usuario'}!
        </h1>
        <p className="text-gray-300">
          Desde aquí puedes gestionar tu cuenta y realizar un seguimiento de tus pedidos.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Pedidos Totales</h3>
          <p className="text-3xl font-bold text-indigo-400">12</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Pedidos Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-400">2</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Favoritos</h3>
          <p className="text-3xl font-bold text-green-400">8</p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Pedido #1234 completado</span>
            <span className="text-sm text-gray-500">Hace 2 días</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Perfil actualizado</span>
            <span className="text-sm text-gray-500">Hace 1 semana</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-300">Nuevo portátil agregado a favoritos</span>
            <span className="text-sm text-gray-500">Hace 2 semanas</span>
          </div>
        </div>
      </div>
    </div>
  )
}