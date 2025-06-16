
// Interfaz base para laptop (coincide con tu API de C#)
export interface ApiLaptop {
  id: string;
  image: string;
  categoria: string;
  marca: string;
  modelo: string;
  procesador: string;
  ramgb: number;
  almacenamientogb: number;
  precio: number;
  pulgadas: number;
  grafica?: string; // Puede ser "TarjetaGrafica" en el backend
  descripcion?: string;
}




// Interfaz para el frontend (la que usas en Products.tsx)
export interface Laptop {
  id: number;
  modelo: string;
  marca: string;
  categoria: string;
  precio: number;
  imagen: string;
  procesador: string;
  ramgb: string;
  almacenamientogb: string;
  pulgadas: string;
  grafica: string;
  descripcion: string;
}

// Interfaz para formularios
export interface FormData {
  image: string;
  categoria: string;
  marca: string;
  modelo: string;
  procesador: string;
  ramgb: string;
  almacenamientogb: string;
  precio: string;
  pulgadas: string;
  grafica: string;
  descripcion: string;
}



class LaptopService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vm.juanma.dev/products-ai-api/api/Laptop';
  }

  // Convertir datos de la API al formato del frontend
  private convertApiToLaptop(apiLaptop: ApiLaptop): Laptop {
    return {
      id: parseInt(apiLaptop.id.replace(/-/g, '').substring(0, 8), 16),
      modelo: apiLaptop.modelo,
      marca: apiLaptop.marca,
      categoria: apiLaptop.categoria.toLowerCase(),
      precio: apiLaptop.precio,
      imagen: apiLaptop.image,
      procesador: apiLaptop.procesador,
      ramgb: `${apiLaptop.ramgb}GB`,
      almacenamientogb: `${apiLaptop.almacenamientogb}GB`,
      pulgadas: `${apiLaptop.pulgadas}"`,
      grafica: apiLaptop.grafica || '',
      descripcion: apiLaptop.descripcion || ''
    };
  }

  // Convertir FormData a formato API
 private convertFormToApi(formData: FormData): Omit<ApiLaptop, 'id'> {
  return {
    image: formData.image,
    categoria: formData.categoria,
    marca: formData.marca,
    modelo: formData.modelo,
    procesador: formData.procesador,
    ramgb: parseInt(formData.ramgb),
    almacenamientogb: parseInt(formData.almacenamientogb),
    precio: parseFloat(formData.precio),
    pulgadas: parseFloat(formData.pulgadas),
    grafica: formData.grafica || "Integrada",
    descripcion: formData.descripcion || ""
  };
}

  // Obtener todas las laptops
  async getAllLaptops(): Promise<Laptop[]> {
    try {
      console.log('Fetching laptops from:', this.baseUrl);
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data: ApiLaptop[] = await response.json()
      console.log('Datos recibidos:', data)
      console.log('Número de laptops:', Array.isArray(data) ? data.length : 'No es array')

      return Array.isArray(data) ? data.map(this.convertApiToLaptop) : [];
      
    } catch (error) {
      console.error('Error fetching laptops:', error);
      
      // Manejo específico de errores
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica que la API esté ejecutándose en http://localhost:8000 y que permita CORS.');
      }
      
      throw error instanceof Error ? error : new Error('Error desconocido al cargar laptops');
    }
  }

  // Obtener laptops para admin (formato API original)
  async getAllLaptopsForAdmin(): Promise<ApiLaptop[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data: ApiLaptop[] = await response.json()
      
      console.log('Datos recibidos:', data)
      console.log('Número de laptops:', Array.isArray(data) ? data.length : 'No es array')

      return data;
      
    } catch (error) {
      console.error('Error fetching laptops for admin:', error);
      throw error instanceof Error ? error : new Error('Error desconocido');
    }
  }

  // Crear nueva laptop
  async createLaptop(formData: FormData): Promise<ApiLaptop> {
    try {
      const laptopData = this.convertFormToApi(formData);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(laptopData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('Error creating laptop:', error);
      throw error instanceof Error ? error : new Error('Error al crear laptop');
    }
  }

  // Actualizar laptop existente
  // Actualizar laptop existente
async updateLaptop(id: string, formData: FormData): Promise<void> {
  try {
    const laptopData = this.convertFormToApi(formData);
    
    // Crear el objeto completo que espera la API
    const updatePayload = {
      id: id, // Incluir el ID como string o GUID
      image: laptopData.image,
      categoria: laptopData.categoria,
      marca: laptopData.marca,
      modelo: laptopData.modelo,
      procesador: laptopData.procesador,
      ramgb: laptopData.ramgb,
      almacenamientogb: laptopData.almacenamientogb,
      precio: laptopData.precio,
      pulgadas: laptopData.pulgadas,
      grafica: laptopData.grafica,
      descripcion: laptopData.descripcion
    };
    
    console.log('Enviando datos de actualización:', updatePayload);
    
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    // No intentar parsear JSON si la respuesta es NoContent (204)
    if (response.status === 204) {
      return; // UpdateLaptop devuelve NoContent(), no JSON
    }

    // Solo si hay contenido, intentar parsearlo
    if (response.headers.get('content-length') !== '0') {
      return await response.json();
    }
    
  } catch (error) {
    console.error('Error updating laptop:', error);
    throw error instanceof Error ? error : new Error('Error al actualizar laptop');
  }
}

  // Eliminar laptop
  async deleteLaptop(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      console.error('Error deleting laptop:', error);
      throw error instanceof Error ? error : new Error('Error al eliminar laptop');
    }
  }

  // Verificar conexión con la API
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, { 
        method: 'HEAD',
        mode: 'cors'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Exportar instancia singleton
export const laptopService = new LaptopService();

// Exportar clase para testing
export default LaptopService;