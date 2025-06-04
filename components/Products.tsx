'use client'

import { useState, useEffect } from 'react'
import { laptops, Laptop } from '../data/laptops'
import ProductCard from './ProductCard'

interface ProductoNuevo {
  id: string
  nombre: string
  precio: number
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

export default function Products() {
  const [productosNuevos, setProductosNuevos] = useState<ProductoNuevo[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos')

  useEffect(() => {
    // Cargar productos nuevos del localStorage
    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]')
    setProductosNuevos(productosGuardados)
  }, [])

  // Convertir productos nuevos al formato Laptop para usar el mismo ProductCard
  const convertirALaptop = (producto: ProductoNuevo): Laptop => ({
    id: parseInt(producto.id),
    name: producto.nombre,
    brand: 'Usuario', // Marca genérica para productos de usuarios
    category: producto.categoria,
    price: producto.precio,
    image: producto.imagen,
    specs: {
      processor: producto.especificaciones.procesador,
      ram: producto.especificaciones.ram,
      storage: producto.especificaciones.almacenamiento,
      screen: producto.especificaciones.pantalla,
      graphics: producto.especificaciones.tarjetaGrafica || 'Integrada'
    },
    description: producto.descripcion,
    isUserGenerated: true // Flag para identificar productos de usuarios
  })

  // Combinar productos estáticos con los nuevos
  const laptopsConvertidos = productosNuevos.map(convertirALaptop)
  const todosLosLaptops = [...laptops, ...laptopsConvertidos]

  // Filtrar por categoría
  const laptopsFiltrados = categoriaSeleccionada === 'todos' 
    ? todosLosLaptops 
    : todosLosLaptops.filter(laptop => laptop.category === categoriaSeleccionada)

  const categorias = [
    { id: 'todos', nombre: 'Todos' },
    { id: 'gaming', nombre: 'Gaming' },
    { id: 'trabajo', nombre: 'Trabajo' },
    { id: 'estudiantes', nombre: 'Estudiantes' },
    { id: 'creadores', nombre: 'Creadores' }
  ]

  return (
    <section id="productos" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Nuestros Portátiles</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Selección premium de los mejores portátiles del mercado
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
        {laptopsFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No se encontraron productos en esta categoría.
            </p>
          </div>
        )}

        {/* Mostrar contador de productos nuevos si hay */}
        {productosNuevos.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-blue-400">
              ✨ {productosNuevos.length} producto{productosNuevos.length !== 1 ? 's' : ''} agregado{productosNuevos.length !== 1 ? 's' : ''} recientemente por la comunidad
            </p>
          </div>
        )}
      </div>
    </section>
  )
}