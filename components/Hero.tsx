'use client'

export default function Hero() {
  const scrollToProducts = (): void => {
    const element = document.getElementById('productos')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="hero-bg py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
          Los Mejores
          <span className="block text-gray-300">Portátiles del Mercado</span>
        </h1>
        <p className="text-xl lg:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto">
          Encuentra el portátil perfecto para trabajo, gaming, estudios y más
        </p>
        <button 
          onClick={scrollToProducts}
          className="btn-primary px-8 py-4 rounded-lg text-white font-semibold text-lg"
        >
          Ver Productos
        </button>
      </div>
    </section>
  )
}