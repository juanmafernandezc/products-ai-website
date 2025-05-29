import { laptops } from '../data/laptops'
import ProductCard from './ProductCard'

export default function Products(): JSX.Element {
  return (
    <section id="productos" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Nuestros Portátiles</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Selección premium de los mejores portátiles del mercado
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {laptops.map((laptop, index) => (
            <ProductCard 
              key={laptop.id} 
              laptop={laptop} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}