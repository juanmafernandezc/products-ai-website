import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserProfile } from '@clerk/nextjs'

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-300">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Profile Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información básica */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre Completo
              </label>
              <p className="text-white bg-gray-700 px-3 py-2 rounded-md">
                {user?.firstName} {user?.lastName || 'No especificado'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <p className="text-white bg-gray-700 px-3 py-2 rounded-md">
                {user?.emailAddresses[0]?.emailAddress || 'No especificado'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Usuario desde
              </label>
              <p className="text-white bg-gray-700 px-3 py-2 rounded-md">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Última conexión
              </label>
              <p className="text-white bg-gray-700 px-3 py-2 rounded-md">
                {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString('es-ES') : 'No disponible'}
              </p>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Preferencias</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Categoría Favorita
              </label>
              <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none">
                <option value="">Seleccionar categoría</option>
                <option value="gaming">Gaming</option>
                <option value="trabajo">Trabajo</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="ultrabooks">Ultrabooks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Presupuesto Preferido
              </label>
              <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none">
                <option value="">Seleccionar rango</option>
                <option value="0-500">€0 - €500</option>
                <option value="500-1000">€500 - €1000</option>
                <option value="1000-1500">€1000 - €1500</option>
                <option value="1500+">€1500+</option>
              </select>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="newsletter" 
                className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="newsletter" className="ml-2 text-sm text-gray-300">
                Recibir newsletter con ofertas especiales
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="notifications" 
                className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="notifications" className="ml-2 text-sm text-gray-300">
                Notificaciones de nuevos productos
              </label>
            </div>
          </div>
          <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Guardar Preferencias
          </button>
        </div>
      </div>

      {/* Clerk UserProfile Component */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Gestión Avanzada de Cuenta</h2>
        <div className="clerk-profile-container">
          <UserProfile 
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: "#4f46e5",
                colorText: "#ffffff",
                colorBackground: "#374151",
                colorInputBackground: "#4b5563",
                colorInputText: "#ffffff",
                borderRadius: "0.5rem",
              },
              elements: {
                card: "bg-transparent",
                navbar: "bg-gray-700",
                navbarButton: "text-gray-300 hover:text-white",
                navbarButtonActive: "bg-indigo-600 text-white",
                pageScrollBox: "bg-transparent",
                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}