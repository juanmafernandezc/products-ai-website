'use client';

import { useState, useEffect } from 'react';
import { Laptop } from '@/types/laptops';

export default function LaptopList() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState<string>('');

  useEffect(() => {
    fetchLaptops();
  }, [categoria]);

  const fetchLaptops = async () => {
    try {
      const url = categoria 
        ? `/api/laptops?categoria=${categoria}`
        : '/api/laptops';
        
      const response = await fetch(url);
      const data = await response.json();
      setLaptops(data);
    } catch (error) {
      console.error('Error al cargar laptops:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    let numericPrice: number;
    if (typeof price === 'number') {
      numericPrice = price;
    } else {
      numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(numericPrice);
  };

  if (loading) return <div>Cargando laptops...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todas las categorías</option>
          <option value="gaming">Gaming</option>
          <option value="trabajo">Trabajo</option>
          <option value="estudiantes">Estudiantes</option>
          <option value="creadores">Creadores</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laptops.map((laptop) => (
          <div key={laptop.id} className="border rounded-lg p-4 shadow-md">
            <img 
              src={laptop.imagen} 
              alt={`${laptop.marca} ${laptop.modelo}`}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-xl font-bold mb-2">
              {laptop.marca} {laptop.modelo}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Categoría:</strong> {laptop.categoria}</p>
              <p><strong>Procesador:</strong> {laptop.procesador}</p>
              <p><strong>RAM:</strong> {laptop.ramgb}</p>
              <p><strong>Almacenamiento:</strong> {laptop.almacenamientogb}</p>
              <p><strong>Pantalla:</strong> {laptop.pulgadas}</p>
              {laptop.grafica && (
                <p><strong>Gráfica:</strong> {laptop.grafica}</p>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(laptop.precio)}
              </p>
            </div>
            {laptop.descripcion && (
              <p className="mt-2 text-sm text-gray-700">
                {laptop.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}