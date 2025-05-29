export default function Contact(): JSX.Element {
  return (
    <section id="contacto" className="py-20 bg-black border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">¿Necesitas Ayuda?</h2>
        <p className="text-gray-400 text-lg mb-8">
          Contacta con nosotros y te ayudaremos a encontrar el portátil perfecto
        </p>
        <button className="btn-primary px-8 py-4 rounded-lg text-white font-semibold text-lg">
          Contactar
        </button>
      </div>
    </section>
  )
}