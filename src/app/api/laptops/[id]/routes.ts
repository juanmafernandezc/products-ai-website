import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Laptop } from '@/types/laptops';

// Tipo para datos de creación/actualización de laptop
interface LaptopData {
  imagen: string;
  categoria: string;
  marca: string;
  modelo: string; // Cambiado de 'nombre' a 'modelo'
  procesador: string;
  ramgb: string;
  almacenamientogb: string;
  precio: number;
  pulgadas: string;
  grafica?: string;
  descripcion?: string;
}

// GET - Obtener todas las laptops
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const marca = searchParams.get('marca');
    
    let query = 'SELECT * FROM Laptops';
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (categoria) {
      conditions.push('categoria = $' + (params.length + 1));
      params.push(categoria);
    }
    
    if (marca) {
      conditions.push('marca ILIKE $' + (params.length + 1));
      params.push(`%${marca}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY marca, modelo'; // Cambiado de 'nombre' a 'modelo'
    
    const result = await pool.query(query, params);
    const laptops: Laptop[] = result.rows;
    
    return NextResponse.json(laptops);
  } catch (error) {
    console.error('Error al obtener laptops:', error);
    return NextResponse.json(
      { error: 'Error al obtener laptops' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva laptop
export async function POST(request: NextRequest) {
  try {
    const body: LaptopData = await request.json();
    
    const {
      imagen,
      categoria,
      marca,
      modelo, // Cambiado de 'nombre' a 'modelo'
      procesador,
      ramgb,
      almacenamientogb,
      precio,
      pulgadas,
      grafica,
      descripcion
    } = body;
    
    // Validaciones
    if (!imagen || !categoria || !marca || !modelo || !procesador || !ramgb || !almacenamientogb || !precio || !pulgadas) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    const query = `
      INSERT INTO Laptops (imagen, categoria, marca, modelo, procesador, ramgb, almacenamientogb, precio, pulgadas, grafica, descripcion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      imagen,
      categoria,
      marca,
      modelo, // Cambiado de 'nombre' a 'modelo'
      procesador,
      ramgb,
      almacenamientogb,
      precio,
      pulgadas,
      grafica || null,
      descripcion || null
    ];
    
    const result = await pool.query(query, values);
    const nuevaLaptop: Laptop = result.rows[0];
    
    return NextResponse.json(nuevaLaptop, { status: 201 });
  } catch (error) {
    console.error('Error al crear laptop:', error);
    return NextResponse.json(
      { error: 'Error al crear laptop' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar laptop existente
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'ID de laptop inválido' },
        { status: 400 }
      );
    }
    
    const body: LaptopData = await request.json();
    
    const {
      imagen,
      categoria,
      marca,
      modelo, // Cambiado de 'nombre' a 'modelo'
      procesador,
      ramgb,
      almacenamientogb,
      precio,
      pulgadas,
      grafica,
      descripcion
    } = body;
    
    // Validaciones
    if (!imagen || !categoria || !marca || !modelo || !procesador || !ramgb || !almacenamientogb || !precio || !pulgadas) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE Laptops 
      SET imagen = $1, categoria = $2, marca = $3, modelo = $4, procesador = $5, 
          ramgb = $6, almacenamientogb = $7, precio = $8, pulgadas = $9, 
          grafica = $10, descripcion = $11
      WHERE id = $12
      RETURNING *
    `;
    
    const values = [
      imagen,
      categoria,
      marca,
      modelo, // Cambiado de 'nombre' a 'modelo'
      procesador,
      ramgb,
      almacenamientogb,
      precio,
      pulgadas,
      grafica || null,
      descripcion || null,
      parseInt(id)
    ];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Laptop no encontrada' },
        { status: 404 }
      );
    }
    
    const laptopActualizada: Laptop = result.rows[0];
    
    return NextResponse.json(laptopActualizada);
  } catch (error) {
    console.error('Error al actualizar laptop:', error);
    return NextResponse.json(
      { error: 'Error al actualizar laptop' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar laptop
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'ID de laptop inválido' },
        { status: 400 }
      );
    }
    
    const query = 'DELETE FROM Laptops WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Laptop no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Laptop eliminada exitosamente', id: parseInt(id) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar laptop:', error);
    return NextResponse.json(
      { error: 'Error al eliminar laptop' },
      { status: 500 }
    );
  }
}