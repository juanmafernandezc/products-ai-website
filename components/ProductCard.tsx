import Image from 'next/image'
import { Laptop } from '../data/laptops'

interface ProductCardProps {
  laptop: Laptop
  index: number
}

export default function ProductCard({ laptop, index }: ProductCardProps): JSX.Element {
  const animationDelay = `animate-delay-${(index + 1) * 100}`
  
  return (
    <div className={`product-card bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 opacity-0 animate-fade-in-up ${animationDelay}`}>
      <div className="relative overflow-hidden">
        <Image 
          src={laptop.image} 
          alt={laptop.name} 
          width={400}
          height={300}
          className="w-full h-48 object-cover transition-transform duration-300"
          loading="lazy"
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
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
          <div className="text-2xl font-bold text-white price-gradient">
            €{laptop.price.toLocaleString()}
          </div>
          <button className="btn-primary px-4 py-2 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  )
}