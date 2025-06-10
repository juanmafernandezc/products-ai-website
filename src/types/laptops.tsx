// Interfaz unificada para Laptop en español (compatible con tu API)
export interface Laptop {
  id: number
  modelo: string
  marca: string
  categoria: string
  precio: number
  imagen: string
  procesador: string
  ramgb: string
  almacenamientogb: string
  pulgadas: string
  grafica: string
  descripcion: string
  creadoPorUsuario?: boolean
  fechaCreacion?: string
  creadoPor?: string
}

// Interfaz para los datos que vienen de tu API externa
export interface ApiLaptop {
  id: string;
  image: string;
  categoria: string;
  marca: string;
  modelo: string;
  procesador: string;
  ramGb: number;
  almacenamientoGb: number;
  precio: number;
  pulgadas: number;
  tarjetaGrafica: string;
  descripcion: string;
}

// Tipos para las categorías disponibles
export type CategoriaLaptop = 'gaming' | 'trabajo' | 'estudiantes' | 'creadores' | 'otros'

// Interface para filtros
export interface FiltroProductos {
  categoria: CategoriaLaptop | 'todos'
  precioMin?: number
  precioMax?: number
  marca?: string
}

// Función helper para convertir datos de la API
export const convertApiToLaptop = (apiLaptop: ApiLaptop): Laptop => {
  return {
    id: parseInt(apiLaptop.id.replace(/-/g, '').substring(0, 8), 16), // Convertir UUID a número
    modelo: apiLaptop.modelo,
    marca: apiLaptop.marca,
    categoria: apiLaptop.categoria.toLowerCase(),
    precio: apiLaptop.precio,
    imagen: apiLaptop.image,
    procesador: apiLaptop.procesador,
    ramgb: `${apiLaptop.ramGb}GB`,
    almacenamientogb: `${apiLaptop.almacenamientoGb}GB`,
    pulgadas: `${apiLaptop.pulgadas}"`,
    grafica: apiLaptop.tarjetaGrafica,
    descripcion: apiLaptop.descripcion
  }
}