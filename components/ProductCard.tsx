// import Image from 'next/image' // Comentado temporalmente
import { Laptop } from '../data/laptops'

interface ProductCardProps {
  laptop: Laptop
  index: number
}

export default function ProductCard({ laptop, index }: ProductCardProps) {
  const animationDelay = `animate-delay-${(index + 1) * 100}`
  
  return (
    <div className={`product-card bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 opacity-0 animate-fade-in-up ${animationDelay} relative`}>
      {/* Badge para productos agregados por usuarios */}
      {laptop.isUserGenerated && (
        <div className="absolute top-2 left-2 bg-green-600/90 px-2 py-1 rounded-lg z-10">
          <span className="text-xs text-white font-medium">NUEVO</span>
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <img 
          src={laptop.image} 
          alt={laptop.name} 
          className="w-full h-48 object-cover transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 rounded-lg">
          <span className="text-xs text-white font-medium uppercase">{laptop.category}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{laptop.name}</h3>
          <span className="text-sm text-gray-400">{laptop.brand}</span>
        </div>
        
        {/* Mostrar descripción para productos de usuarios */}
        {laptop.isUserGenerated && laptop.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {laptop.description}
          </p>
        )}
        
        <div className="space-y-1 mb-4 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Procesador:</span>
            <span className="text-gray-300">{laptop.specs.processor}</span>
          </div>
          <div className="flex justify-between">
            <span>RAM:</span>
            <span className="text-gray-300">{laptop.specs.ram}</span>
          </div>
          <div className="flex justify-between">
            <span>Almacenamiento:</span>
            <span className="text-gray-300">{laptop.specs.storage}</span>
          </div>
          <div className="flex justify-between">
            <span>Pantalla:</span>
            <span className="text-gray-300">{laptop.specs.screen}</span>
          </div>
          {/* Mostrar tarjeta gráfica si existe */}
          {laptop.specs.graphics && laptop.specs.graphics !== 'Integrada' && (
            <div className="flex justify-between">
              <span>Gráficos:</span>
              <span className="text-gray-300">{laptop.specs.graphics}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
          <div className="text-2xl font-bold text-white price-gradient">
            €{laptop.price.toLocaleString()}
          </div>
          <button className="btn-primary px-4 py-2 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors">
            Ver Detalles
          </button>
        </div>
        
        {/* Indicador adicional para productos de usuarios */}
        {laptop.isUserGenerated && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <span className="text-xs text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Agregado por la comunidad
            </span>
          </div>
        )}
      </div>
    </div>
  )
}