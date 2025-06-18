'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
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

// Interfaces para la búsqueda con IA
interface BusquedaRequest {
  consulta: string;
}

interface BusquedaResponse {
  consultaOriginal: string;
  totalEncontrados: number;
  laptops: ApiLaptop[];
  timestamp: string;
}

export default function Products() {
  const { user, isSignedIn } = useUser()
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [laptopsOriginales, setLaptopsOriginales] = useState<Laptop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos')
  
  // Estados para búsqueda IA
  const [consultaIA, setConsultaIA] = useState<string>('')
  const [buscandoIA, setBuscandoIA] = useState(false)
  const [errorBusquedaIA, setErrorBusquedaIA] = useState<string | null>(null)
  const [mostrandoResultadosIA, setMostrandoResultadosIA] = useState(false)
  const [ultimaConsulta, setUltimaConsulta] = useState<string>('')

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const PRODUCTOS_POR_PAGINA = 6

  useEffect(() => {
    fetchLaptops()
  }, [])

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1)
  }, [categoriaSeleccionada, mostrandoResultadosIA])

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
      
      const response = await fetch('https://vm.juanma.dev/products-ai-api/api/Laptop', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setLaptopsOriginales(laptopsConvertidas) // Guardar copia original
      
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

  // Función para buscar con IA
  const buscarConIA = async () => {
    if (!consultaIA.trim()) {
      setErrorBusquedaIA('Por favor ingresa una consulta de búsqueda')
      return
    }

    try {
      setBuscandoIA(true)
      setErrorBusquedaIA(null)
      
      const requestBody: BusquedaRequest = {
        consulta: consultaIA.trim()
      }

      console.log('Enviando consulta a IA:', requestBody)

      const response = await fetch('https://vm.juanma.dev/products-ai-api/api/Gemini/buscar-laptops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error en búsqueda IA:', errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: BusquedaResponse = await response.json()
      console.log('Respuesta de IA:', data)

      // Convertir y mostrar resultados
      const laptopsEncontradas = data.laptops.map(convertApiToLaptop)
      setLaptops(laptopsEncontradas)
      setMostrandoResultadosIA(true)
      setUltimaConsulta(consultaIA)
      setCategoriaSeleccionada('todos') // Reset categoria filter

    } catch (error) {
      console.error('Error en búsqueda IA:', error)
      setErrorBusquedaIA(error instanceof Error ? error.message : 'Error en la búsqueda con IA')
    } finally {
      setBuscandoIA(false)
    }
  }

  // Función para limpiar búsqueda IA
  const limpiarBusquedaIA = () => {
    setConsultaIA('')
    setLaptops(laptopsOriginales)
    setMostrandoResultadosIA(false)
    setUltimaConsulta('')
    setErrorBusquedaIA(null)
    setCategoriaSeleccionada('todos')
    setPaginaActual(1)
  }

  // Manejar Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarConIA()
    }
  }

  // Filtrar por categoría (solo si no estamos mostrando resultados de IA)
  const laptopsFiltrados = mostrandoResultadosIA 
    ? laptops 
    : (categoriaSeleccionada === 'todos' 
        ? laptops 
        : laptops.filter(laptop => laptop.categoria === categoriaSeleccionada))

  // Cálculos de paginación
  const totalPaginas = Math.ceil(laptopsFiltrados.length / PRODUCTOS_POR_PAGINA)
  const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const indiceFin = indiceInicio + PRODUCTOS_POR_PAGINA
  const laptopsPaginados = laptopsFiltrados.slice(indiceInicio, indiceFin)

  // Funciones de navegación de página
  const irAPagina = (pagina: number) => {
    setPaginaActual(pagina)
    // Scroll suave hacia la sección de productos
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
  }

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      irAPagina(paginaActual - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      irAPagina(paginaActual + 1)
    }
  }

  // Generar números de página para mostrar
  const generarNumerosPagina = () => {
    const numeros: number[] = []
    const rango = 2 // Mostrar 2 páginas antes y después de la actual

    for (let i = Math.max(1, paginaActual - rango); i <= Math.min(totalPaginas, paginaActual + rango); i++) {
      numeros.push(i)
    }

    return numeros
  }

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
                PROBAR API
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
            {laptopsFiltrados.length} producto{laptopsFiltrados.length !== 1 ? 's' : ''} disponible{laptopsFiltrados.length !== 1 ? 's' : ''}
            {totalPaginas > 1 && (
              <span className="ml-2">
                - Página {paginaActual} de {totalPaginas}
              </span>
            )}
          </p>
        </div>

        {/* Búsqueda con IA - Solo para usuarios autenticados */}
        {isSignedIn && (
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Búsqueda Inteligente</h3>
                  <div className="px-2 py-1 bg-purple-600/20 rounded-full">
                    <span className="text-xs text-purple-300">IA</span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">
                  Describe qué tipo de laptop necesitas en lenguaje natural. Ejemplo: "Laptops que soporten Cyberpunk 2077"
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={consultaIA}
                      onChange={(e) => setConsultaIA(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu consulta aquí... (ej: 'Laptops para gaming con presupuesto de $1500')"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      disabled={buscandoIA}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={buscarConIA}
                      disabled={buscandoIA || !consultaIA.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px] flex items-center justify-center"
                    >
                      {buscandoIA ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Buscando...</span>
                        </div>
                      ) : (
                        '🔍 Buscar'
                      )}
                    </button>
                    
                    {mostrandoResultadosIA && (
                      <button
                        onClick={limpiarBusquedaIA}
                        className="px-4 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                        title="Limpiar búsqueda"
                      >
                        ✖️
                      </button>
                    )}
                  </div>
                </div>

                {/* Error de búsqueda IA */}
                {errorBusquedaIA && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{errorBusquedaIA}</p>
                  </div>
                )}

                {/* Indicador de resultados IA */}
                {mostrandoResultadosIA && (
                  <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/50 rounded-lg">
                    <p className="text-purple-300 text-sm">
                      <span className="font-medium">Búsqueda IA:</span> "{ultimaConsulta}" - 
                      <span className="ml-1">{laptops.length} resultado{laptops.length !== 1 ? 's' : ''} encontrado{laptops.length !== 1 ? 's' : ''}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filtros por categoría - Solo mostrar si no hay resultados de IA */}
        {!mostrandoResultadosIA && (
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
        )}

        {/* Grid de productos paginados */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 min-h-[600px]">
          {laptopsPaginados.map((laptop, index) => (
            <ProductCard 
              key={laptop.id} 
              laptop={laptop} 
              index={index}
            />
          ))}
        </div>

        {/* Controles de paginación */}
        {totalPaginas > 1 && (
          <div className="mt-12 flex justify-center items-center">
            <div className="flex items-center gap-2">
              {/* Botón anterior */}
              <button
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Primera página si no está visible */}
              {generarNumerosPagina()[0] > 1 && (
                <>
                  <button
                    onClick={() => irAPagina(1)}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    1
                  </button>
                  {generarNumerosPagina()[0] > 2 && (
                    <span className="text-gray-500 px-2">...</span>
                  )}
                </>
              )}

              {/* Números de página */}
              {generarNumerosPagina().map((numeroPagina) => (
                <button
                  key={numeroPagina}
                  onClick={() => irAPagina(numeroPagina)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    numeroPagina === paginaActual
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {numeroPagina}
                </button>
              ))}

              {/* Última página si no está visible */}
              {generarNumerosPagina()[generarNumerosPagina().length - 1] < totalPaginas && (
                <>
                  {generarNumerosPagina()[generarNumerosPagina().length - 1] < totalPaginas - 1 && (
                    <span className="text-gray-500 px-2">...</span>
                  )}
                  <button
                    onClick={() => irAPagina(totalPaginas)}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    {totalPaginas}
                  </button>
                </>
              )}

              {/* Botón siguiente */}
              <button
                onClick={paginaSiguiente}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay productos en la categoría */}
        {laptopsFiltrados.length === 0 && laptops.length > 0 && !mostrandoResultadosIA && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No se encontraron productos en esta categoría.
            </p>
          </div>
        )}

        {/* Mensaje cuando la búsqueda IA no devuelve resultados */}
        {laptopsFiltrados.length === 0 && mostrandoResultadosIA && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-xl text-gray-400 mb-2">
                No se encontraron laptops que coincidan con tu búsqueda
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Intenta con una consulta diferente o más específica
              </p>
              <button
                onClick={limpiarBusquedaIA}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
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