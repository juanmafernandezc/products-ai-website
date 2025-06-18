"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Header from "../../../../components/Header"
import Footer from "../../../../components/Footer"
import { laptopService, type ApiLaptop, type FormData } from "../../../services/laptopservices"
import { useScrollToAnchor } from "../../hooks/useNavigations"

export default function GestorProductos() {
  const { user, isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const { navigateToSection } = useScrollToAnchor()
  const [isLoading, setIsLoading] = useState(false)
  const [laptops, setLaptops] = useState<ApiLaptop[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [laptopToDelete, setLaptopToDelete] = useState<ApiLaptop | null>(null)
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    image: "",
    categoria: "Gaming",
    marca: "",
    modelo: "",
    procesador: "",
    ramgb: "",
    almacenamientogb: "",
    precio: "",
    pulgadas: "",
    grafica: "",
    descripcion: "",
  })

  useEffect(() => {
    if (isSignedIn) {
      fetchLaptops()
    }
  }, [isSignedIn])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isSignedIn, isLoaded, router])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const fetchLaptops = async () => {
    try {
      setError(null)
      const data = await laptopService.getAllLaptopsForAdmin()
      setLaptops(data)
      console.log("Laptops cargadas:", data.length)
    } catch (error) {
      console.error("Error al cargar laptops:", error)
      setError(error instanceof Error ? error.message : "Error al cargar laptops")
    }
  }

    useEffect(() => {
    if (showDeleteModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showDeleteModal])

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-white text-xl">Cargando...</div>
        </div>
      </main>
    )
  }

  if (!isSignedIn) {
    return null
  }

  const resetForm = () => {
    setFormData({
      image: "",
      categoria: "Gaming",
      marca: "",
      modelo: "",
      procesador: "",
      ramgb: "",
      almacenamientogb: "",
      precio: "",
      pulgadas: "",
      grafica: "",
      descripcion: "",
    })
    setEditingId(null)
    setError(null)
    setSuccessMessage(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (editingId) {
        await laptopService.updateLaptop(editingId, formData)
        setSuccessMessage("¡Laptop actualizada exitosamente!")
      } else {
        await laptopService.createLaptop(formData)
        setSuccessMessage("¡Laptop agregada exitosamente!")
      }

      await fetchLaptops()
      resetForm()
    } catch (error) {
      console.error("Error al guardar laptop:", error)
      setError(error instanceof Error ? error.message : "Error desconocido al guardar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (laptop: ApiLaptop) => {
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
      grafica: laptop.grafica || "",
      descripcion: laptop.descripcion || "",
    })
    setEditingId(laptop.id)
    setActiveTab("add")
    setError(null)
    setSuccessMessage(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = (laptop: ApiLaptop) => {
    console.log("🎯 Seleccionando laptop para eliminar:", laptop.id, laptop.marca, laptop.modelo)
    setLaptopToDelete(laptop)
    setShowDeleteModal(true)
    console.log("Renderizando página:", showDeleteModal, laptopToDelete)
  }

  const confirmDelete = async () => {
    if (!laptopToDelete) {
      console.error("❌ No hay laptop seleccionada para eliminar")
      setError("No hay laptop seleccionada")
      return
    }

    console.log("🗑️ Eliminando laptop:", laptopToDelete.id, laptopToDelete.marca, laptopToDelete.modelo)
    setIsDeleting(true)
    setError(null)

    try {
      console.log("📡 Llamando a laptopService.deleteLaptop con ID:", laptopToDelete.id)
      await laptopService.deleteLaptop(laptopToDelete.id)

      console.log("✅ Eliminación exitosa")

      setShowDeleteModal(false)
      setLaptopToDelete(null)

      setSuccessMessage(`Laptop "${laptopToDelete.marca} ${laptopToDelete.modelo}" eliminada exitosamente`)

      console.log("🔄 Recargando lista de laptops...")
      await fetchLaptops()
    } catch (error) {
      console.error("💥 Error completo al eliminar:", error)

      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(`Error al eliminar laptop: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    console.log("Cancelando eliminación")
    setShowDeleteModal(false)
    setLaptopToDelete(null)
    setIsDeleting(false)
  }

  const filteredLaptops = laptops.filter(
    (laptop) =>
      laptop.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const BackToHomeButton = () => (
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        ← Volver al Inicio
      </button>
      <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
      <div></div>
    </div>
  )

  const QuickAccessButtons = () => (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <h3 className="text-white font-semibold mb-4">Acceso Rápido</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigateToSection("/", "products")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          🛍️ Ver Productos Públicos
        </button>
        <button
          onClick={() => navigateToSection("/", "categories")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          📂 Ver Categorías
        </button>
        <button
          onClick={() => navigateToSection("/", "contact")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          📞 Contacto
        </button>
      </div>
    </div>
  )



  return (
    <main className="min-h-screen bg-gray-900">
      <Header />

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <BackToHomeButton />
          <QuickAccessButtons />

          {/* Panel de estado de la API */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">Estado de la API:</span>
                <span className="text-green-400">🟢 Conectado</span>
              </div>
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-white hover:text-gray-200 text-xl">
                ✕
              </button>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">✅</span>
                <span>{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-white hover:text-gray-200 text-xl">
                ✕
              </button>
            </div>
          )}

          {/* Navegación por tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab("add")}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === "add" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                {editingId ? "✏️ Editar Laptop" : "➕ Agregar Laptop"}
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === "manage" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                🛠️ Gestionar Laptops ({laptops.length})
              </button>
            </div>
          </div>

          {/* Formulario de agregar/editar */}
          {activeTab === "add" && (
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h1 className="text-3xl font-bold text-white mb-8 text-center">
                {editingId ? "Editar Laptop" : "Agregar Nueva Laptop"}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Marca *</label>
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
                    <label className="block text-white font-semibold mb-2">Modelo *</label>
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
                    <label className="block text-white font-semibold mb-2">Precio (€) *</label>
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
                    <label className="block text-white font-semibold mb-2">Categoría *</label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Gaming">Gaming</option>
                      <option value="Trabajo">Trabajo</option>
                      <option value="Estudiante">Estudiante</option>
                      <option value="Creadores">Creadores</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">URL de la Imagen *</label>
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Procesador *</label>
                    <input
                      type="text"
                      name="procesador"
                      value={formData.procesador}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Ej: Intel Core i7, Apple M2"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">RAM (GB) *</label>
                    <input
                      type="number"
                      name="ramgb"
                      value={formData.ramgb}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="16"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Almacenamiento (GB) *</label>
                    <input
                      type="number"
                      name="almacenamientogb"
                      value={formData.almacenamientogb}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="512"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Pulgadas *</label>
                    <input
                      type="number"
                      name="pulgadas"
                      value={formData.pulgadas}
                      onChange={handleChange}
                      step="0.1"
                      required
                      min="10"
                      max="20"
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="13.3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Gráfica</label>
                  <input
                    type="text"
                    name="grafica"
                    value={formData.grafica}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Ej: NVIDIA RTX 4060, Integrada"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Descripción detallada del producto..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      <>{editingId ? "💾 Actualizar" : "➕ Agregar"} Laptop</>
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Panel de gestión */}
          {activeTab === "manage" && (
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Gestionar Laptops ({laptops.length})</h2>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Buscar por modelo, marca o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {filteredLaptops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-300 text-lg">
                    {laptops.length === 0 ? "No hay laptops registradas" : "No se encontraron resultados"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLaptops.map((laptop, index) => (
                    <div key={laptop.id} className="bg-gray-700 rounded-lg p-6 flex items-center gap-6">
                      <div className="w-20 h-20 bg-gray-600 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={laptop.image || "/placeholder.svg"}
                          alt={laptop.modelo}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.nextElementSibling?.classList.remove("hidden")
                          }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate">
                          {laptop.marca} {laptop.modelo}
                        </h3>
                        <p className="text-gray-300 text-sm capitalize">
                          {laptop.categoria} • {laptop.procesador}
                        </p>
                        <p className="text-blue-400 font-semibold">
                          €{laptop.precio.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {laptop.ramgb}GB RAM • {laptop.almacenamientogb}GB • {laptop.pulgadas}"
                        </p>
                        <p className="text-gray-500 text-xs">ID: {laptop.id}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(laptop)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(laptop)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                          title={`Eliminar ${laptop.marca} ${laptop.modelo}`}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      {showDeleteModal && laptopToDelete && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelDelete()
            }
          }}
        >
          <div
            className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-600 transform animate-in fade-in zoom-in duration-300 relative"
            style={{ zIndex: 100000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🗑️</span>
                Confirmar Eliminación
              </h3>
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-300 mb-4">¿Estás seguro de que deseas eliminar esta laptop?</p>

            <div className="bg-gray-700 rounded-lg p-4 mb-4 border border-gray-600">
              <p className="text-white font-semibold text-lg">
                {laptopToDelete.marca} {laptopToDelete.modelo}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {laptopToDelete.categoria} • €{laptopToDelete.precio.toLocaleString("es-ES")}
              </p>
              <p className="text-yellow-400 text-xs mt-2 font-mono">ID: {laptopToDelete.id}</p>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-300 text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <span>🗑️</span>
                    Sí, Eliminar
                  </>
                )}
              </button>

              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span>❌</span> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  )
}
