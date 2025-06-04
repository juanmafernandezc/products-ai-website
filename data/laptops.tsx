export interface Laptop {
  id: number
  name: string
  brand: string
  category: string
  price: number
  image: string
  specs: {
    processor: string
    ram: string
    storage: string
    screen: string
    graphics?: string // Nuevo campo opcional
  }
  description?: string // Nuevo campo opcional para productos de usuarios
  isUserGenerated?: boolean // Flag para identificar productos de usuarios
}

export const laptops: Laptop[] = [
  {
    id: 1,
    name: "MacBook Pro 16\"",
    brand: "Apple",
    price: 2499,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    specs: {
      processor: "M3 Pro",
      ram: "18GB",
      storage: "512GB SSD",
      screen: "16.2\" Liquid Retina XDR"
    },
    category: "trabajo"
  },
  {
    id: 2,
    name: "ROG Strix G17",
    brand: "ASUS",
    price: 1799,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
    specs: {
      processor: "AMD Ryzen 9",
      ram: "32GB DDR5",
      storage: "1TB SSD",
      screen: "17.3\" FHD 144Hz"
    },
    category: "gaming"
  },
  {
    id: 3,
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1899,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    specs: {
      processor: "Intel Core i7",
      ram: "16GB LPDDR5",
      storage: "1TB SSD",
      screen: "14\" WUXGA IPS"
    },
    category: "trabajo"
  },
  {
    id: 4,
    name: "Surface Laptop 5",
    brand: "Microsoft",
    price: 1299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    specs: {
      processor: "Intel Core i5",
      ram: "8GB LPDDR5x",
      storage: "256GB SSD",
      screen: "13.5\" PixelSense"
    },
    category: "estudiantes"
  },
  {
    id: 5,
    name: "Alienware m15 R7",
    brand: "Dell",
    price: 2299,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
    specs: {
      processor: "Intel Core i9",
      ram: "32GB DDR5",
      storage: "1TB SSD",
      screen: "15.6\" QHD 240Hz"
    },
    category: "gaming"
  },
  {
    id: 6,
    name: "MacBook Air M2",
    brand: "Apple",
    price: 1199,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    specs: {
      processor: "Apple M2",
      ram: "8GB",
      storage: "256GB SSD",
      screen: "13.6\" Liquid Retina"
    },
    category: "estudiantes"
  },
  {
    id: 7,
    name: "Razer Blade 15",
    brand: "Razer",
    price: 2799,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
    specs: {
      processor: "Intel Core i7",
      ram: "16GB DDR4",
      storage: "1TB SSD",
      screen: "15.6\" QHD 165Hz"
    },
    category: "gaming"
  },
  {
    id: 8,
    name: "HP Spectre x360",
    brand: "HP",
    price: 1599,
    image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop",
    specs: {
      processor: "Intel Core i7",
      ram: "16GB LPDDR4x",
      storage: "512GB SSD",
      screen: "13.5\" OLED Touch"
    },
    category: "trabajo"
  },
  {
    id: 9,
    name: "Acer Aspire 5",
    brand: "Acer",
    price: 649,
    image: "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400&h=300&fit=crop",
    specs: {
      processor: "AMD Ryzen 5",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      screen: "15.6\" FHD IPS"
    },
    category: "estudiantes"
  },
]