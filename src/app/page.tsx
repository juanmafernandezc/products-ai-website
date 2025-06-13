import Header from '../../components/Header'
import Hero from '../../components/Hero'
import Categories from '../../components/Categories'
import Products from '../../components/Products'
import About from '../../components/About'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'

export default function Home() {
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
    </main>
  )
}