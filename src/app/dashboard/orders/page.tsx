import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()

  // Datos de ejemplo - en una app real vendrían de una base de datos
  const orders = [
    {
      id: '1234',
      date: '2024-12-15',
      status: 'Entregado',
      total: 1299.99,
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 1299.99 }
      ]
    },
    {
      id: '1235',
      date: '2024-12-10',
      status: 'En tránsito',
      total: 899.50,
      items: [
        { name: 'ASUS ROG Strix G15', quantity: 1, price: 899.50 }
      ]
    },
    {
      id: '1236',
      date: '2024-12-05',
      status: 'Procesando',
      total: 1599.99,
      items: [
        { name: 'Dell XPS 13', quantity: 1, price: 1599.99 }
      ]
    },
    {
      id: '1237',
      date: '2024-11-28',
      status: 'Entregado',
      total: 699.99,
      items: [
        { name: 'Lenovo ThinkPad E14', quantity: 1, price: 699.99 }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'en tránsito':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'procesando':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColorDark = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'bg-green-900 text-green-300 border-green-700'
      case 'en tránsito':
        return 'bg-blue-900 text-blue-300 border-blue-700'
      case 'procesando':
        return 'bg-yellow-900 text-yellow-300 border-yellow-700'
      case 'cancelado':
        return 'bg-red-900 text-red-300 border-red-700'
      default:
        return 'bg-gray-900 text-gray-300 border-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Mis Pedidos</h1>
        <p className="text-gray-300">
          Historial completo de tus compras y estado de entregas
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-indigo-400">{orders.length}</p>
          <p className="text-sm text-gray-300">Total Pedidos</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-400">
            {orders.filter(o => o.status === 'Entregado').length}
          </p>
          <p className="text-sm text-gray-300">Entregados</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-400">
            {orders.filter(o => o.status === 'En tránsito').length}
          </p>
          <p className="text-sm text-gray-300">En Tránsito</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {orders.filter(o => o.status === 'Procesando').length}
          </p>
          <p className="text-sm text-gray-300">Procesando</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estado
            </label>
            <select className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none">
              <option value="">Todos los estados</option>
              <option value="entregado">Entregado</option>
              <option value="en-transito">En tránsito</option>
              <option value="procesando">Procesando</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fecha
            </label>
            <select className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-indigo-500 focus:outline-none">
              <option value="">Todas las fechas</option>
              <option value="ultima-semana">Última semana</option>
              <option value="ultimo-mes">Último mes</option>
              <option value="ultimos-3-meses">Últimos 3 meses</option>
              <option value="ultimo-ano">Último año</option>
            </select>
          </div>
          <div className="flex-1"></div>
          <div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Pedido #{order.id}
                  </h3>
                  <p className="text-sm text-gray-300">
                    Realizado el {new Date(order.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColorDark(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  €{order.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items del pedido */}
            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">IMG</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-sm text-gray-300">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-white font-medium">€{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex flex-wrap gap-2">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  Ver Detalles
                </button>
                {order.status === 'Entregado' && (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                    Descargar Factura
                  </button>
                )}
                {order.status === 'En tránsito' && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                    Rastrear Envío
                  </button>
                )}
                {order.status === 'Entregado' && (
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                    Volver a Comprar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
          Anterior
        </button>
        <span className="px-3 py-2 bg-indigo-600 text-white rounded-md">1</span>
        <span className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 cursor-pointer transition-colors">2</span>
        <span className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 cursor-pointer transition-colors">3</span>
        <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
          Siguiente
        </button>
      </div>
    </div>
  )
}