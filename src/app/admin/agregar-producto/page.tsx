'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

// Interfaz que coincide con el modelo de C#
interface Laptop {
  id: string
  image: string
  categoria: string
  marca: string
  modelo: string
  procesador: string
  ramgb: number
  almacenamientogb: number
  precio: number
  pulgadas: number
  grafica?: string
  descripcion?: string
}

// Interfaz para el formulario (más amigable)
interface FormData {
  image: string
  categoria: string
  marca: string
  modelo: string
  procesador: string
  ramgb: string
  almacenamientogb: string
  precio: string
  pulgadas: string
  grafica: string
  descripcion: string
}

export default function GestorProductos() {
  const { user, isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [laptopToDelete, setLaptopToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add')
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // URL base de tu API - ajusta según tu configuración
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api'
  
  const [formData, setFormData] = useState<FormData>({
    image: '',
    categoria: 'gaming',
    marca: '',
    modelo: '',
    procesador: '',
    ramgb: '',
    almacenamientogb: '',
    precio: '',
    pulgadas: '',
    grafica: '',
    descripcion: ''
  })

  // Cargar laptops desde la API
  const fetchLaptops = async () => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/laptop`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setLaptops(data)
    } catch (error) {
      console.error('Error fetching laptops:', error)
      setError(`Error al cargar laptops: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      fetchLaptops()
    }
  }, [isSignedIn])

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
      image: '',
      categoria: 'gaming',
      marca: '',
      modelo: '',
      procesador: '',
      ramgb: '',
      almacenamientogb: '',
      precio: '',
      pulgadas: '',
      grafica: '',
      descripcion: ''
    })
    setEditingId(null)
    setError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // Convertir FormData a formato Laptop
      const laptopData: Omit<Laptop, 'id'> = {
        image: formData.image,
        categoria: formData.categoria,
        marca: formData.marca,
        modelo: formData.modelo,
        procesador: formData.procesador,
        ramgb: parseInt(formData.ramgb),
        almacenamientogb: parseInt(formData.almacenamientogb),
        precio: parseFloat(formData.precio),
        pulgadas: parseFloat(formData.pulgadas),
        grafica: formData.grafica || undefined,
        descripcion: formData.descripcion || undefined
      }

      let response: Response

      if (editingId) {
        // Actualizar laptop existente
        response = await fetch(`${API_BASE_URL}/laptop/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...laptopData, id: editingId })
        })
      } else {
        // Crear nueva laptop
        response = await fetch(`${API_BASE_URL}/laptop`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(laptopData)
        })
      }

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      // Recargar la lista de laptops
      await fetchLaptops()
      resetForm()
      
      alert(editingId ? '¡Laptop actualizada exitosamente!' : '¡Laptop agregada exitosamente!')
      
    } catch (error) {
      console.error('Error al guardar laptop:', error)
      setError(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (laptop: Laptop) => {
    setFormData({
      image: laptop.image,
      categoria: laptop.categoria,
      marca: laptop.marca,
      modelo: laptop.modelo,
      procesador: laptop.procesador,
      ramgb: laptop.ramgb.toString(),
      almacenamientogb: laptop.almacenamientogb.toString(),
      precio: laptop.precio.toString(),
      pulgadas: laptop.pulgadas.toString(),
      grafica: laptop.grafica || '',
      descripcion: laptop.descripcion || ''
    })
    setEditingId(laptop.id)
    setActiveTab('add')
    setError(null)
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: string) => {
    setLaptopToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!laptopToDelete) return
    
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/laptop/${laptopToDelete}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      // Recargar la lista de laptops
      await fetchLaptops()
      setShowDeleteModal(false)
      setLaptopToDelete(null)
      alert('Laptop eliminada exitosamente')
      
    } catch (error) {
      console.error('Error al eliminar laptop:', error)
      setError(`Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      setShowDeleteModal(false)
      setLaptopToDelete(null)
    }
  }

  const filteredLaptops = laptops.filter(laptop =>
    laptop.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laptop.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laptop.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-900">
      <Header />
      
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Mostrar errores si los hay */}
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

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
                {editingId ? '✏️ Editar Laptop' : '➕ Agregar Laptop'}
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'manage'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                🛠️ Gestionar Laptops ({laptops.length})
              </button>
            </div>
          </div>

          {/* Formulario de agregar/editar */}
          {activeTab === 'add' && (
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h1 className="text-3xl font-bold text-white mb-8 text-center">
                {editingId ? 'Editar Laptop' : 'Agregar Nueva Laptop'}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      name="marca"
                      value={formData.marca}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Ej: Apple, Dell, HP"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Ej: MacBook Pro M2, XPS 13"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    URL de la Imagen *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
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
                        name="procesador"
                        value={formData.procesador}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="Intel i7-12700H"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        RAM (GB) *
                      </label>
                      <input
                        type="number"
                        name="ramgb"
                        value={formData.ramgb}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="16"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Almacenamiento (GB) *
                      </label>
                      <input
                        type="number"
                        name="almacenamientogb"
                        value={formData.almacenamientogb}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="512"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Pulgadas *
                      </label>
                      <input
                        type="number"
                        name="pulgadas"
                        value={formData.pulgadas}
                        onChange={handleChange}
                        step="0.1"
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="15.6"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">
                        Tarjeta Gráfica
                      </label>
                      <input
                        type="text"
                        name="grafica"
                        value={formData.grafica}
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
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                    placeholder="Describe las características principales y beneficios de la laptop..."
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-4 justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    {isLoading ? 'Guardando...' : (editingId ? 'Actualizar Laptop' : 'Agregar Laptop')}
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

          {/* Lista de laptops para gestionar */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Gestionar Laptops ({laptops.length})
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchLaptops}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      🔄 Actualizar
                    </button>
                    <div className="flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="🔍 Buscar laptops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {filteredLaptops.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💻</div>
                    <h3 className="text-xl text-gray-300 mb-2">
                      {laptops.length === 0 ? 'No hay laptops aún' : 'No se encontraron laptops'}
                    </h3>
                    <p className="text-gray-400">
                      {laptops.length === 0 
                        ? 'Agrega tu primera laptop usando el formulario de arriba'
                        : 'Intenta con otros términos de búsqueda'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredLaptops.map((laptop) => (
                      <div key={laptop.id} className="bg-gray-700 rounded-lg p-6 flex flex-col md:flex-row gap-6">
                        <div className="md:w-32 h-32 flex-shrink-0">
                          <img
                            src={laptop.image}
                            alt={`${laptop.marca} ${laptop.modelo}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/128x128/374151/9CA3AF?text=No+Image'
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">
                                {laptop.marca} {laptop.modelo}
                              </h3>
                              <p className="text-2xl font-bold text-blue-400 mb-2">€{laptop.precio}</p>
                              {laptop.descripcion && (
                                <p className="text-gray-300 mb-3 line-clamp-2">{laptop.descripcion}</p>
                              )}
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-400">Categoría:</span>
                                  <div className="text-white font-medium">{laptop.categoria}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">CPU:</span>
                                  <div className="text-white font-medium">{laptop.procesador}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">RAM:</span>
                                  <div className="text-white font-medium">{laptop.ramgb}GB</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Almacenamiento:</span>
                                  <div className="text-white font-medium">{laptop.almacenamientogb}GB</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Pantalla:</span>
                                  <div className="text-white font-medium">{laptop.pulgadas}"</div>
                                </div>
                                {laptop.grafica && (
                                  <div>
                                    <span className="text-gray-400">GPU:</span>
                                    <div className="text-white font-medium">{laptop.grafica}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 md:ml-4">
                              <button
                                onClick={() => handleEdit(laptop)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleDelete(laptop.id)}
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
              ¿Estás seguro de que quieres eliminar esta laptop? Esta acción no se puede deshacer.
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