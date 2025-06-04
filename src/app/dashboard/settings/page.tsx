import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-gray-300">
          Personaliza tu experiencia y gestiona tus preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Notificaciones */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Notificaciones</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificaciones por email</p>
                <p className="text-sm text-gray-300">Recibir actualizaciones de pedidos y ofertas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificaciones push</p>
                <p className="text-sm text-gray-300">Alertas en tiempo real en tu navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Newsletter semanal</p>
                <p className="text-sm text-gray-300">Resumen de productos y tendencias</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Ofertas personalizadas</p>
                <p className="text-sm text-gray-300">Descuentos basados en tus preferencias</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferencias de compra */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Preferencias de Compra</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Moneda preferida
              </label>
              <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none">
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dólar ($)</option>
                <option value="GBP">Libra (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idioma
              </label>
              <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Método de pago predeterminado
              </label>
              <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none">
                <option value="">Seleccionar cada vez</option>
                <option value="card">Tarjeta de crédito</option>
                <option value="paypal">PayPal</option>
                <option value="transfer">Transferencia bancaria</option>
              </select>
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="save-favorites" 
                className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
              <label htmlFor="save-favorites" className="ml-2 text-sm text-gray-300">
                Guardar productos en favoritos automáticamente
              </label>
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Privacidad y Datos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Cookies de seguimiento</p>
                <p className="text-sm text-gray-300">Permitir cookies para personalización</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Análisis de uso</p>
                <p className="text-sm text-gray-300">Ayudar a mejorar el servicio</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Compartir datos con socios</p>
                <p className="text-sm text-gray-300">Para ofertas y recomendaciones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-2">
                Descargar mis datos
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Solicitar eliminación de cuenta
              </button>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Seguridad</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Autenticación de dos factores</p>
                <p className="text-sm text-gray-300">Añade una capa extra de seguridad</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <p className="text-white font-medium mb-2">Cambiar contraseña</p>
              <p className="text-sm text-gray-300 mb-3">Última actualización: hace 3 meses</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Actualizar Contraseña
              </button>
            </div>

            <div>
              <p className="text-white font-medium mb-2">Sesiones activas</p>
              <p className="text-sm text-gray-300 mb-3">Gestiona tus dispositivos conectados</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">💻</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Chrome en Windows</p>
                      <p className="text-gray-300 text-xs">Valencia, España - Activo ahora</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-xs">Actual</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📱</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Safari en iPhone</p>
                      <p className="text-gray-300 text-xs">Madrid, España - hace 2 días</p>
                    </div>
                  </div>
                  <button className="text-red-400 text-xs hover:text-red-300">Cerrar</button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Cerrar todas las sesiones
              </button>
            </div>
          </div>
        </div>

        {/* Facturación */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Facturación</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dirección de facturación
              </label>
              <textarea 
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none resize-none"
                rows={3}
                placeholder="Introduce tu dirección completa..."
                defaultValue="Calle Principal 123, 46001 Valencia, España"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                NIF/CIF
              </label>
              <input 
                type="text" 
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none"
                placeholder="12345678A"
              />
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="business-invoice" 
                className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="business-invoice" className="ml-2 text-sm text-gray-300">
                Facturación empresarial
              </label>
            </div>

            <div>
              <p className="text-white font-medium mb-2">Historial de facturas</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <div>
                    <p className="text-white text-sm">Factura #2024-001</p>
                    <p className="text-gray-300 text-xs">15 Dic 2024 - €1,299.99</p>
                  </div>
                  <button className="text-indigo-400 text-sm hover:text-indigo-300">
                    Descargar
                  </button>
                </div>
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <div>
                    <p className="text-white text-sm">Factura #2024-002</p>
                    <p className="text-gray-300 text-xs">10 Dic 2024 - €899.50</p>
                  </div>
                  <button className="text-indigo-400 text-sm hover:text-indigo-300">
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soporte */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Soporte y Ayuda</h2>
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium mb-2">Centro de ayuda</p>
              <p className="text-sm text-gray-300 mb-3">
                Encuentra respuestas a las preguntas más frecuentes
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Visitar Centro de Ayuda
              </button>
            </div>

            <div>
              <p className="text-white font-medium mb-2">Contactar soporte</p>
              <p className="text-sm text-gray-300 mb-3">
                ¿Necesitas ayuda personalizada? Nuestro equipo está aquí para ti
              </p>
              <div className="flex space-x-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  Chat en vivo
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  Enviar email
                </button>
              </div>
            </div>

            <div>
              <p className="text-white font-medium mb-2">Reportar problema</p>
              <p className="text-sm text-gray-300 mb-3">
                Ayúdanos a mejorar reportando errores o sugerencias
              </p>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Reportar Problema
              </button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="text-center text-sm text-gray-400">
                <p>Versión de la aplicación: 2.1.0</p>
                <p>Términos de servicio • Política de privacidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de guardar global */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-medium">¿Has realizado cambios?</p>
            <p className="text-sm text-gray-300">No olvides guardar tu configuración</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors">
              Cancelar
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}