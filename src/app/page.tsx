'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Header from '../../components/Header'
import Hero from '../../components/Hero'
import Categories from '../../components/Categories'
import Products from '../../components/Products'
import About from '../../components/About'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'

export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useUser()

  const navigateToAdmin = () => {
    if (isSignedIn) {
      router.push('/admin/productos')
    } else {
      // Opcional: mostrar mensaje de que necesita autenticarse
      alert('Necesitas iniciar sesión para acceder al panel de administración')
      // O redirigir a la página de login
      // router.push('/sign-in')
    }
  }

  return (
     <main>
      <Header />
      <section id="hero">
        <Hero />
      </section>
      <section id="categories">
        <Categories />
      </section>
      <section id="products">
        <Products />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
      
      {/* Botones de administración - puedes colocarlos donde necesites */}
      {isSignedIn && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={navigateToAdmin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
          >
            ⚙️ Panel Admin
          </button>
        </div>
      )}
    </main>
  )
}