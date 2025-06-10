'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Trash2, Edit, Plus, Save, X } from 'lucide-react'

// Tipo actualizado para coincidir con tu API
interface Laptop {
  id: string // GUID como string
  image: string
  categoria: string
  marca: string
  modelo: string
  procesador: string
  ramGb: number // Cambiado para coincidir con tu API
  almacenamientoGb: number // Cambiado para coincidir con tu API
  precio: number
  pulgadas: number
  tarjetaGrafica?: string // Cambiado para coincidir con tu API
  descripcion?: string
}

interface EditingLaptop extends Omit<Laptop, 'id'> {
  id?: string
}

export default function AdminProducts() {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editForm, setEditForm] = useState<EditingLaptop>({
    image: '',
    categoria: 'otros',
    marca: '',
    modelo: '',
    procesador: '',
    ramGb: 0,
    almacenamientoGb: 0,
    precio: 0,
    pulgadas: 0,
    tarjetaGrafica: '',
    descripcion: ''
  })

  // URL base de tu API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  useEffect(() => {
    if (isLoaded && userId) {
      fetchLaptops()
    }
  }, [isLoaded, userId])

  const fetchLaptops = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/Laptop`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
      if (!response.ok) throw new Error('Error al cargar laptops')
      const data = await response.json()
      setLaptops(data)
    } catch (error) {
      setError('Error al cargar los productos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (laptop: Laptop) => {
    setEditingId(laptop.id)
    setEditForm({ ...laptop })
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setEditForm({
      image: '',
      categoria: 'otros',
      marca: '',
      modelo: '',
      procesador: '',
      ramGb: 0,
      almacenamientoGb: 0,
      precio: 0,
      pulgadas: 0,
      tarjetaGrafica: '',
      descripcion: ''
    })
  }

  const handleSave = async () => {
    try {
      const method = isCreating ? 'POST' : 'PUT'
      const url = isCreating ? `${API_BASE_URL}/Laptop` : `${API_BASE_URL}/Laptop/${editingId}`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al guardar: ${errorText}`)
      }

      await fetchLaptops()
      setEditingId(null)
      setIsCreating(false)
    } catch (error) {
      setError('Error al guardar el producto')
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/Laptop/${id}`, {
        method: 'DELETE',
        mode: 'cors',
      })

      if (!response.ok) throw new Error('Error al eliminar')

      await fetchLaptops()
    } catch (error) {
      setError('Error al eliminar el producto')
      console.error(error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
  }

  const handleInputChange = (field: keyof EditingLaptop, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Administración de Productos</h1>
            <p className="text-gray-400">Bienvenido, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Agregar Producto
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-100 mt-2"
            >
              Cerrar
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Formulario de creación */}
            {isCreating && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Crear Nuevo Producto</h3>
                <EditForm 
                  editForm={editForm}
                  onInputChange={handleInputChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            )}

            {/* Lista de productos */}
            {laptops.map((laptop) => (
              <div key={laptop.id} className="bg-gray-800 rounded-lg p-6">
                {editingId === laptop.id ? (
                  <EditForm 
                    editForm={editForm}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={laptop.image} 
                        alt={laptop.modelo}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-laptop.png'
                        }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{laptop.marca} {laptop.modelo}</h3>
                        <p className="text-gray-400">{laptop.categoria} - €{laptop.precio}</p>
                        <p className="text-sm text-gray-500">
                          {laptop.procesador} • {laptop.ramGb}GB RAM • {laptop.almacenamientoGb}GB • {laptop.pulgadas}"
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(laptop)}
                        className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(laptop.id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {laptops.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No hay productos registrados</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Crear el primer producto
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Componente del formulario de edición
function EditForm({ 
  editForm, 
  onInputChange, 
  onSave, 
  onCancel 
}: {
  editForm: EditingLaptop
  onInputChange: (field: keyof EditingLaptop, value: string | number) => void
  onSave: () => void
  onCancel: () => void
}) {
  const categorias = [
    { value: 'gaming', label: 'Gaming' },
    { value: 'trabajo', label: 'Trabajo' },
    { value: 'estudiantes', label: 'Estudiantes' },
    { value: 'creadores', label: 'Creadores' },
    { value: 'otros', label: 'Otros' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Marca *"
        value={editForm.marca}
        onChange={(e) => onInputChange('marca', e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        required
      />
      <input
        type="text"
        placeholder="Modelo *"
        value={editForm.modelo}
        onChange={(e) => onInputChange('modelo', e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        required
      />
      <select
        value={editForm.categoria}
        onChange={(e) => onInputChange('categoria', e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        required
      >
        {categorias.map(cat => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Precio *"
        value={editForm.precio}
        onChange={(e) => onInputChange('precio', parseFloat(e.target.value) || 0)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        min="0"
        step="0.01"
        required
      />
      <input
        type="url"
        placeholder="URL de imagen *"
        value={editForm.image}
        onChange={(e) => onInputChange('image', e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        required
      />
      <input
        type="text"
        placeholder="Procesador *"
        value={editForm.procesador}
        onChange={(e) => onInputChange('procesador', e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        required
      />
      <input
        type="number"
        placeholder="RAM (GB) *"
        value={editForm.ramGb}
        onChange={(e) => onInputChange('ramGb', parseInt(e.target.value) || 0)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        min="1"
        required
      />
      <input
        type="number"
        placeholder="Almacenamiento (GB) *"
        value={editForm.almacenamientoGb}
        onChange={(e) => onInputChange('almacenamientoGb', parseInt(e.target.value) || 0)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        min="1"
        required
      />
      <input
        type="number"
        placeholder="Pulgadas *"
        value={editForm.pulgadas}
        onChange={(e) => onInputChange('pulgadas', parseFloat(e.target.value) || 0)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        min="10"
        max="20"
        step="0.1"
        required
      />
      <input
        type="text"
        placeholder="Tarjeta gráfica"
        value={editForm.tarjetaGrafica || ''}
        onChange={(e) => onInputChange('tarjetaGrafica', e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
      <textarea
        placeholder="Descripción"
        value={editForm.descripcion || ''}
        onChange={(e) => onInputChange('descripcion', e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none md:col-span-2 h-24 resize-none"
        rows={3}
      />
      <div className="md:col-span-2 flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <X size={16} />
          Cancelar
        </button>
        <button
          onClick={onSave}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Save size={16} />
          Guardar
        </button>
      </div>
    </div>
  )
}