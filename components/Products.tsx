'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { Laptop } from '../src/types/laptops'

// Interfaz para el formato de datos de tu API
interface ApiLaptop {
  id: string;
  image: string;
  categoria: string;
  marca: string;
  modelo: string;
  procesador: string;
  ramgb: number;
  almacenamientogb: number;
  precio: number;
  pulgadas: number;
  tarjetaGrafica: string;
  descripcion: string;
}

export default function Products() {
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos')

  useEffect(() => {
    fetchLaptops()
  }, [])

  // Función para convertir datos de la API al formato de la interfaz Laptop
  const convertApiToLaptop = (apiLaptop: ApiLaptop): Laptop => {
    return {
      id: parseInt(apiLaptop.id.replace(/-/g, '').substring(0, 8), 16), // Convertir UUID a número
      modelo: apiLaptop.modelo,
      marca: apiLaptop.marca,
      categoria: apiLaptop.categoria.toLowerCase(), // Convertir a minúsculas para consistencia
      precio: apiLaptop.precio,
      imagen: apiLaptop.image,
      procesador: apiLaptop.procesador,
      ramgb: `${apiLaptop.ramgb}GB`,
      almacenamientogb: `${apiLaptop.almacenamientogb}GB`,
      pulgadas: `${apiLaptop.pulgadas}"`,
      grafica: apiLaptop.tarjetaGrafica,
      descripcion: apiLaptop.descripcion
    }
  }

  const fetchLaptops = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Iniciando petición a la API externa...')
      
      const response = await fetch('http://localhost:8000/api/Laptop', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar headers adicionales si tu API los requiere
          // 'Authorization': 'Bearer token',
          // 'Accept': 'application/json',
        },
        // Agregar mode si tienes problemas de CORS
        mode: 'cors',
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data: ApiLaptop[] = await response.json()
      
      console.log('Datos recibidos:', data)
      console.log('Número de laptops:', Array.isArray(data) ? data.length : 'No es array')
      
      // Convertir los datos de la API al formato esperado por la interfaz
      const laptopsConvertidas = Array.isArray(data) 
        ? data.map(convertApiToLaptop)
        : []
      
      console.log('Laptops convertidas:', laptopsConvertidas)
      setLaptops(laptopsConvertidas)
      
    } catch (error) {
      console.error('Error completo:', error)
      
      // Manejo específico de errores de CORS
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Error de conexión. Verifica que la API esté ejecutándose en http://localhost:8000 y que permita CORS.')
      } else {
        setError(error instanceof Error ? error.message : 'Error desconocido al cargar los productos')
      }
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por categoría
  const laptopsFiltrados = categoriaSeleccionada === 'todos' 
    ? laptops 
    : laptops.filter(laptop => laptop.categoria === categoriaSeleccionada)

  const categorias = [
    { id: 'todos', nombre: 'Todos' },
    { id: 'gaming', nombre: 'Gaming' },
    { id: 'trabajo', nombre: 'Trabajo' },
    { id: 'estudiante', nombre: 'Estudiante' },
    { id: 'creadores', nombre: 'Creadores' },
    { id: 'otros', nombre: 'Otros' }
  ]

  if (loading) {
    return (
      <section id="productos" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-white mt-4">Cargando productos...</p>
            <p className="text-sm text-gray-400 mt-2">Conectando con la API...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="productos" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-red-400 mb-4">Error al cargar los productos:</p>
              <p className="text-red-300 text-sm mb-4">{error}</p>
              <button 
                onClick={fetchLaptops}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors mr-2"
              >
                Reintentar
              </button>
              <button 
                onClick={() => window.open('http://localhost:8000/api/Laptop', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Probar API
              </button>
            </div>
            {/* Información de debug */}
            <div className="mt-4 text-xs text-gray-500">
              <p>API Endpoint: http://localhost:8000/api/Laptop</p>
              <p>Revisar Console para más detalles</p>
              <p>Verificar que la API esté ejecutándose y permita CORS</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="productos" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Nuestros Portátiles</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Selección premium de los mejores portátiles del mercado
          </p>
          <p className="text-sm text-blue-400 mt-2">
            {laptops.length} producto{laptops.length !== 1 ? 's' : ''} disponible{laptops.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaSeleccionada(categoria.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                categoriaSeleccionada === categoria.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {laptopsFiltrados.map((laptop, index) => (
            <ProductCard 
              key={laptop.id} 
              laptop={laptop} 
              index={index}
            />
          ))}
        </div>

        {/* Mensaje cuando no hay productos en la categoría */}
        {laptopsFiltrados.length === 0 && laptops.length > 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No se encontraron productos en esta categoría.
            </p>
          </div>
        )}

        {/* Mensaje cuando no hay productos en absoluto */}
        {laptops.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No hay productos disponibles en este momento.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Verificar que la API esté ejecutándose y tenga datos
            </p>
          </div>
        )}
      </div>
    </section>
  )
}