interface Category {
  id: string
  title: string
  description: string
}

export default function Categories() {
  const categories: Category[] = [
    {
      id: 'gaming',
      title: 'Gaming',
      description: 'Portátiles de alto rendimiento para gaming con gráficas dedicadas y procesadores potentes.',
    },
    {
      id: 'trabajo',
      title: 'Trabajo',
      description: 'Equipos profesionales ideales para oficina, productividad y tareas empresariales.',
    },
    {
      id: 'estudiantes',
      title: 'Estudiantes',
      description: 'Portátiles ligeros y económicos perfectos para estudios y uso académico.',
    }
  ]

  return (
    <section id="categorias" className="py-20 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Categorías de Portátiles</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Especialistas en portátiles para cada necesidad y presupuesto
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category: Category) => (
            <div key={category.id} className="feature-card p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">{category.title}</h3>
              <p className="text-gray-400">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}