import Header from '../components/Header'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Products from '../components/Products'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home(): JSX.Element {
  return (
    <main>
      <Header />
      <Hero />
      <Categories />
      <Products />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}