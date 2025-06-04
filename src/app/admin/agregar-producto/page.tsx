'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

interface ProductData {
  id: string
  nombre: string
  precio: string
  descripcion: string
  categoria: string
  imagen: string
  especificaciones: {
    procesador: string
    ram: string
    almacenamiento: string
    pantalla: string
    tarjetaGrafica: string
  }
  fechaCreacion?: string
  creadoPor?: string
}

export default function GestorProductos() {
  const { user, isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [productos, setProductos] = useState<ProductData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState<ProductData>({
    id: '',
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: 'gaming',
    imagen: '',
    especificaciones: {
      procesador: '',
      ram: '',
      almacenamiento: '',
      pantalla: '',
      tarjetaGrafica: ''
    }
  })

  // Cargar productos del localStorage
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]')
    setProductos(productosGuardados)
  }, [])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, isLoaded, router])

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </main>
    )
  }

  if (!isSignedIn) {
    return null
  }

  const resetForm = () => {
    setFormData({
      id: '',
      nombre: '',
      precio: '',
      descripcion: '',
      categoria: 'gaming',
      imagen: '',
      especificaciones: {
        procesador: '',
        ram: '',
        almacenamiento: '',
        pantalla: '',
        tarjetaGrafica: ''
      }
    })
    setEditingId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('spec_')) {
      const specName = name.replace('spec_', '')
      setFormData(prev => ({
        ...prev,
        especificaciones: {
          ...prev.especificaciones,
          [specName]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const productosActuales = JSON.parse(localStorage.getItem('productos') || '[]')
      
      if (editingId) {
        // Editar producto existente
        const index = productosActuales.findIndex((p: ProductData) => p.id === editingId)
        if (index !== -1) {
          productosActuales[index] = {
            ...productosActuales[index],
            ...formData,
            precio: parseFloat(formData.precio)
          }
        }
        alert('¡Producto actualizado exitosamente!')
      } else {
        // Agregar nuevo producto
        const nuevoProducto = {
          ...formData,
          precio: parseFloat(formData.precio),
          fechaCreacion: new Date().toISOString(),
          creadoPor: user?.id,
          id: Date.now().toString()
        }
        productosActuales.push(nuevoProducto)
        alert('¡Producto agregado exitosamente!')
      }

      localStorage.setItem('productos', JSON.stringify(productosActuales))
      setProductos(productosActuales)
      resetForm()
      
    } catch (error) {
      console.error('Error al guardar producto:', error)
      alert('Error al guardar el producto. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (producto: ProductData) => {
    setFormData({
      ...producto,
      precio: producto.precio.toString()
    })
    setEditingId(producto.id || null)
    setActiveTab('add')
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: string) => {
    setProductToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      const productosActuales = productos.filter(p => p.id !== productToDelete)
      localStorage.setItem('productos', JSON.stringify(productosActuales))
      setProductos(productosActuales)
      setShowDeleteModal(false)
      setProductToDelete(null)
      alert('Producto eliminado exitosamente')
    }
  }

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-900">
      <Header />
      
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Tabs de navegación */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('add')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'add'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {editingId ? '✏️ Editar Producto' : '➕ Agregar Producto'}
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'manage'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                🛠️ Gestionar Productos ({productos.length})
              </button>
            </div>
          </div>

          {/* Formulario de agregar/editar */}
          {activeTab === 'add' && (
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h1 className="text-3xl font-bold text-white mb-8 text-center">
                {editingId ? 'Editar Portátil' : 'Agregar Nuevo Portátil'}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Nombre del Portátil *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Ej: MacBook Pro M2"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Precio (€) *
                    </label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      step="0.01"
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="1299.99"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Categoría *
                    </label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="gaming">Gaming</option>
                      <option value="trabajo">Trabajo</option>
                      <option value="estudiantes">Estudiantes</option>
                      <option value="creadores">Creadores</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      URL de la Imagen *
                    </label>
                    <input
                      type="url"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>

                {/* Especificaciones técnicas */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Especificaciones Técnicas
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Procesador *
                      </label>
                      <input
                        type="text"
                        name="spec_procesador"
                        value={formData.especificaciones.procesador}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="Intel i7-12700H"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        RAM *
                      </label>
                      <input
                        type="text"
                        name="spec_ram"
                        value={formData.especificaciones.ram}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="16GB DDR4"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Almacenamiento *
                      </label>
                      <input
                        type="text"
                        name="spec_almacenamiento"
                        value={formData.especificaciones.almacenamiento}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="512GB SSD"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Pantalla *
                      </label>
                      <input
                        type="text"
                        name="spec_pantalla"
                        value={formData.especificaciones.pantalla}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="15.6' Full HD IPS"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">
                        Tarjeta Gráfica
                      </label>
                      <input
                        type="text"
                        name="spec_tarjetaGrafica"
                        value={formData.especificaciones.tarjetaGrafica}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="NVIDIA RTX 3060"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                    placeholder="Describe las características principales y beneficios del portátil..."
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-4 justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    {isLoading ? 'Guardando...' : (editingId ? 'Actualizar Producto' : 'Agregar Producto')}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                    >
                      Cancelar Edición
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    Volver al Inicio
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de productos para gestionar */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Gestionar Productos ({productos.length})
                  </h2>
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="🔍 Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl text-gray-300 mb-2">
                      {productos.length === 0 ? 'No tienes productos aún' : 'No se encontraron productos'}
                    </h3>
                    <p className="text-gray-400">
                      {productos.length === 0 
                        ? 'Agrega tu primer producto usando el formulario de arriba'
                        : 'Intenta con otros términos de búsqueda'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredProducts.map((producto) => (
                      <div key={producto.id} className="bg-gray-700 rounded-lg p-6 flex flex-col md:flex-row gap-6">
                        <div className="md:w-32 h-32 flex-shrink-0">
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/128x128/374151/9CA3AF?text=No+Image'
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">{producto.nombre}</h3>
                              <p className="text-2xl font-bold text-blue-400 mb-2">€{producto.precio}</p>
                              <p className="text-gray-300 mb-3 line-clamp-2">{producto.descripcion}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-400">Categoría:</span>
                                  <div className="text-white font-medium">{producto.categoria}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">CPU:</span>
                                  <div className="text-white font-medium">{producto.especificaciones.procesador}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">RAM:</span>
                                  <div className="text-white font-medium">{producto.especificaciones.ram}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Almacenamiento:</span>
                                  <div className="text-white font-medium">{producto.especificaciones.almacenamiento}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 md:ml-4">
                              <button
                                onClick={() => handleEdit(producto)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleDelete(producto.id!)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </main>
  )
}