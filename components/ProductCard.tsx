// import Image from 'next/image' // Comentado temporalmente
import { Laptop } from '../src/types/laptops'

interface ProductCardProps {
  laptop: Laptop
  index: number
}

export default function ProductCard({ laptop, index }: ProductCardProps) {
  const animationDelay = `animate-delay-${(index + 1) * 100}`
  
  return (
    <div className={`product-card bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 opacity-0 animate-fade-in-up ${animationDelay} relative`}>
      {/* Badge para productos nuevos */}

      
      <div className="relative overflow-hidden">
        <img 
          src={laptop.imagen} 
          alt={`${laptop.marca} ${laptop.modelo}`} 
          className="w-full h-48 object-cover transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 rounded-lg">
          <span className="text-xs text-white font-medium uppercase">{laptop.categoria}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{laptop.modelo}</h3>
          <span className="text-sm text-gray-400">{laptop.marca}</span>
        </div>
        
        {/* Mostrar descripción si existe */}
        {laptop.descripcion && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {laptop.descripcion}
          </p>
        )}
        
        <div className="space-y-1 mb-4 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Procesador:</span>
            <span className="text-gray-300">{laptop.procesador}</span>
          </div>
          <div className="flex justify-between">
            <span>RAM:</span>
            <span className="text-gray-300">{laptop.ramgb}</span>
          </div>
          <div className="flex justify-between">
            <span>Almacenamiento:</span>
            <span className="text-gray-300">{laptop.almacenamientogb}</span>
          </div>
          <div className="flex justify-between">
            <span>Pantalla:</span>
            <span className="text-gray-300">{laptop.pulgadas}</span>
          </div>
          {/* Mostrar tarjeta gráfica si existe */}
          {laptop.grafica && laptop.grafica !== 'Integrada' && (
            <div className="flex justify-between">
              <span>Gráficos:</span>
              <span className="text-gray-300">{laptop.grafica}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
          <div className="text-2xl font-bold text-white price-gradient">
            €{typeof laptop.precio === 'number' ? laptop.precio.toLocaleString() : laptop.precio}
          </div>
          <button className="btn-primary px-4 py-2 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  )
}