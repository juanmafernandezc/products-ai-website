interface Stat {
  number: string
  label: string
}

export default function About(): JSX.Element {
  const stats: Stat[] = [
    { number: '500+', label: 'Portátiles Vendidos' },
    { number: '3+', label: 'Años de Experiencia' },
    { number: '98%', label: 'Clientes Satisfechos' }
  ]

  return (
    <section id="nosotros" className="py-20 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">¿Por Qué Rock4Code?</h2>
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            {stats.map((stat: Stat, index: number) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}