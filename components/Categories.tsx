interface Category {
  id: string
  title: string
  description: string
  icon: JSX.Element
}

export default function Categories(): JSX.Element {
  const categories: Category[] = [
    {
      id: 'gaming',
      title: 'Gaming',
      description: 'Portátiles de alto rendimiento para gaming con gráficas dedicadas y procesadores potentes.',
      icon: (
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      id: 'trabajo',
      title: 'Trabajo',
      description: 'Equipos profesionales ideales para oficina, productividad y tareas empresariales.',
      icon: (
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
        </svg>
      )
    },
    {
      id: 'estudiantes',
      title: 'Estudiantes',
      description: 'Portátiles ligeros y económicos perfectos para estudios y uso académico.',
      icon: (
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      )
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
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{category.title}</h3>
              <p className="text-gray-400">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}