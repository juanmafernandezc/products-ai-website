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
  grafica?: string;
  descripcion?: string;
}

// Interfaz para el frontend
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
      ramgb: parseInt(formData.ramgb) || 0,
      almacenamientogb: parseInt(formData.almacenamientogb) || 0,
      precio: parseFloat(formData.precio) || 0,
      pulgadas: parseFloat(formData.pulgadas) || 0,
      grafica: formData.grafica || "Integrada",
      descripcion: formData.descripcion || ""
    };
  }

  // Validar FormData antes de enviar
  private validateFormData(formData: FormData): string[] {
    const errors: string[] = [];
    
    if (!formData.marca.trim()) errors.push('La marca es requerida');
    if (!formData.modelo.trim()) errors.push('El modelo es requerido');
    if (!formData.procesador.trim()) errors.push('El procesador es requerido');
    if (!formData.image.trim()) errors.push('La imagen es requerida');
    
    const ramgb = parseInt(formData.ramgb);
    if (isNaN(ramgb) || ramgb <= 0) errors.push('RAM debe ser un número positivo');
    
    const almacenamientogb = parseInt(formData.almacenamientogb);
    if (isNaN(almacenamientogb) || almacenamientogb <= 0) errors.push('Almacenamiento debe ser un número positivo');
    
    const precio = parseFloat(formData.precio);
    if (isNaN(precio) || precio <= 0) errors.push('Precio debe ser un número positivo');
    
    const pulgadas = parseFloat(formData.pulgadas);
    if (isNaN(pulgadas) || pulgadas <= 0) errors.push('Pulgadas debe ser un número positivo');
    
    // Validar URL de imagen
    try {
      new URL(formData.image);
    } catch {
      errors.push('La URL de la imagen no es válida');
    }
    
    return errors;
  }

  // Obtener todas las laptops
  async getAllLaptops(): Promise<Laptop[]> {
    try {
      console.log('🔄 Fetching laptops from:', this.baseUrl);
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data: ApiLaptop[] = await response.json();
      console.log('✅ Datos recibidos:', data.length, 'laptops');

      return Array.isArray(data) ? data.map(this.convertApiToLaptop) : [];
      
    } catch (error) {
      console.error('❌ Error fetching laptops:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica que la API esté ejecutándose y permita CORS.');
      }
      
      throw error instanceof Error ? error : new Error('Error desconocido al cargar laptops');
    }
  }

  // Obtener laptops para admin (formato API original)
  async getAllLaptopsForAdmin(): Promise<ApiLaptop[]> {
    try {
      console.log('🔄 Fetching laptops for admin from:', this.baseUrl);
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data: ApiLaptop[] = await response.json();
      console.log('✅ Admin laptops loaded:', data.length);

      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error('❌ Error fetching laptops for admin:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión con la API. Verifica que esté ejecutándose.');
      }
      
      throw error instanceof Error ? error : new Error('Error desconocido al cargar laptops');
    }
  }

  // Crear nueva laptop
  async createLaptop(formData: FormData): Promise<ApiLaptop> {
    try {
      console.log('➕ Creating new laptop...');
      
      // Validar datos antes de enviar
      const validationErrors = this.validateFormData(formData);
      if (validationErrors.length > 0) {
        throw new Error(`Datos inválidos: ${validationErrors.join(', ')}`);
      }
      
      const laptopData = this.convertFormToApi(formData);
      console.log('📤 Sending laptop data:', laptopData);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(laptopData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Laptop created successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error creating laptop:', error);
      throw error instanceof Error ? error : new Error('Error al crear laptop');
    }
  }

  // Actualizar laptop existente
  async updateLaptop(id: string, formData: FormData): Promise<void> {
    try {
      console.log('📝 Updating laptop with ID:', id);
      
      // Validar ID
      if (!id || id.trim() === '') {
        throw new Error('ID de laptop inválido');
      }
      
      // Validar datos
      const validationErrors = this.validateFormData(formData);
      if (validationErrors.length > 0) {
        throw new Error(`Datos inválidos: ${validationErrors.join(', ')}`);
      }
      
      const laptopData = this.convertFormToApi(formData);
      
      const updatePayload = {
        id: id,
        ...laptopData
      };
      
      console.log('📤 Sending update data:', updatePayload);
      
      const response = await fetch(`${this.baseUrl}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      console.log('✅ Laptop updated successfully');

      // Manejar respuesta vacía (204 No Content)
      if (response.status === 204) {
        return;
      }

      // Solo intentar parsear JSON si hay contenido
      const contentLength = response.headers.get('content-length');
      if (contentLength && contentLength !== '0') {
        return await response.json();
      }
      
    } catch (error) {
      console.error('❌ Error updating laptop:', error);
      throw error instanceof Error ? error : new Error('Error al actualizar laptop');
    }
  }

  // **MÉTODO DELETE COMPLETAMENTE CORREGIDO**
  async deleteLaptop(id: string): Promise<void> {
    try {
      console.log('🗑️ Iniciando eliminación de laptop con ID:', id);
      
      // Validar que el ID no esté vacío
      if (!id || id.trim() === '') {
        throw new Error('ID de laptop inválido o vacío');
      }

      // Construir URL correcta - IMPORTANTE: usar la URL exacta que espera la API
      const deleteUrl = `${this.baseUrl}/${id}`;
      console.log('🌐 URL de eliminación:', deleteUrl);

      // Realizar la petición DELETE
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
        
        // Intentar obtener más detalles del error
        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            errorMessage += ` - ${JSON.stringify(errorData)}`;
          } else {
            const errorText = await response.text();
            if (errorText.trim()) {
              errorMessage += ` - ${errorText}`;
            }
          }
        } catch (parseError) {
          console.warn('⚠️ No se pudo parsear la respuesta de error:', parseError);
        }
        
        // Manejo específico de errores comunes
        if (response.status === 404) {
          throw new Error('La laptop no fue encontrada. Puede que ya haya sido eliminada.');
        } else if (response.status === 400) {
          throw new Error('Solicitud inválida. Verifica el ID de la laptop.');
        } else if (response.status === 500) {
          throw new Error('Error interno del servidor. Contacta al administrador.');
        }
        
        throw new Error(errorMessage);
      }

      // Si llegamos aquí, la eliminación fue exitosa
      console.log('✅ Laptop eliminada exitosamente');
      return;
      
    } catch (error) {
      console.error('💥 Error en la operación de eliminación:', error);
      
      // Manejo específico de errores de red
      if (error instanceof TypeError) {
        if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
          throw new Error('Error de conexión: No se puede conectar con la API. Verifica que esté ejecutándose.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Error de red: Verifica la conexión a internet y la configuración CORS.');
        }
      }

      // Re-lanzar el error con el mensaje original si ya es un Error conocido
      throw error instanceof Error ? error : new Error(`Error desconocido al eliminar: ${String(error)}`);
    }
  }

  // Obtener laptop por ID - MÉTODO MEJORADO
  async getLaptopById(id: string): Promise<ApiLaptop | null> {
    try {
      console.log('🔍 Buscando laptop con ID:', id);
      
      if (!id || id.trim() === '') {
        console.error('❌ ID inválido proporcionado');
        return null;
      }
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Laptop no encontrada con ID:', id);
          return null;
        }
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const laptop = await response.json();
      console.log('✅ Laptop encontrada:', laptop.modelo);
      return laptop;
      
    } catch (error) {
      console.error('❌ Error al obtener laptop por ID:', error);
      return null;
    }
  }

  // Verificar salud de la API
  async checkApiHealth(): Promise<boolean> {
    try {
      console.log('🏥 Verificando estado de la API...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
      const response = await fetch(this.baseUrl, { 
        method: 'HEAD',
        mode: 'cors',
        signal: controller.signal,
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      
      const isHealthy = response.ok;
      console.log(isHealthy ? '✅ API está funcionando correctamente' : '❌ API no responde correctamente');
      return isHealthy;
      
    } catch (error) {
      console.error('❌ Verificación de salud de API falló:', error);
      return false;
    }
  }

  // Método de prueba de conexión completo
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🧪 Probando conexión con la API...');
      
      const startTime = Date.now();
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      const endTime = Date.now();

      const result = {
        success: response.ok,
        message: response.ok ? 'Conexión exitosa con la API' : `Error: ${response.status} ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          responseTime: `${endTime - startTime}ms`,
          timestamp: new Date().toISOString(),
          corsEnabled: response.type === 'cors',
        }
      };

      console.log('🧪 Resultado de prueba de conexión:', result);
      return result;
      
    } catch (error) {
      const result = {
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : String(error)}`,
        details: { 
          error: String(error),
          timestamp: new Date().toISOString(),
          url: this.baseUrl
        }
      };
      
      console.error('🧪 Prueba de conexión falló:', result);
      return result;
    }
  }

  // Método para resetear/limpiar cache si es necesario
  async clearCache(): Promise<void> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Cache limpiado');
      }
    } catch (error) {
      console.warn('⚠️ No se pudo limpiar el cache:', error);
    }
  }

  // Getter para obtener la URL base actual
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Setter para cambiar la URL base si es necesario
  setBaseUrl(newUrl: string): void {
    this.baseUrl = newUrl;
    console.log('🔄 URL de API actualizada a:', newUrl);
  }
}

// Exportar instancia singleton
export const laptopService = new LaptopService();

// Exportar clase para testing
export default LaptopService;