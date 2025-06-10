import Header from '../../components/Header'
import Hero from '../../components/Hero'
import Categories from '../../components/Categories'
import Products from '../../components/Products'
import About from '../../components/About'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'
import LaptopList from '../../components/LaptopList';

export default function Home() {
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