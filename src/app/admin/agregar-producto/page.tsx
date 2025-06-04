'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

export default function AgregarProducto() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    imagen: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Aquí iría la lógica para guardar el producto
      // Por ejemplo, una llamada a una API
      console.log('Producto a guardar:', formData)
      
      // Simular guardado exitoso
      alert('Producto agregado exitosamente!')
      
      // Redirigir a la página principal o de productos
      router.push('/')
      
    } catch (error) {
      console.error('Error al agregar producto:', error)
      alert('Error al agregar el producto')
    }
  }

  return (
    <main>
      <Header />
      
      <section className="add-product-section" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Agregar Nuevo Producto</h1>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del producto:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                margin: '0.5rem 0',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio">Precio:</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              step="0.01"
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                margin: '0.5rem 0',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría:</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                margin: '0.5rem 0',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Seleccionar categoría</option>
              <option value="electronica">Electrónica</option>
              <option value="ropa">Ropa</option>
              <option value="hogar">Hogar</option>
              <option value="deportes">Deportes</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagen">URL de la imagen:</label>
            <input
              type="url"
              id="imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              style={{
                width: '100%',
                padding: '0.5rem',
                margin: '0.5rem 0',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem',
                margin: '0.5rem 0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Agregar Producto
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
      
      <Footer />
    </main>
  )
}