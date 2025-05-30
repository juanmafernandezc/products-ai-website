// components/Navbar.tsx
'use client'; // Importante para componentes con interactividad en el App Router

import Link from 'next/link';
// import Image from 'next/image'; // Descomenta si vas a usar un logo de imagen

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 h-16 flex items-center justify-between px-4">
      {/* Sección izquierda: Logo/Nombre de la marca */}
      <div className="flex items-center space-x-2">
        {/* Si tienes un logo, podrías usar Image aquí. Ejemplo: */}
        {/* <Image src="/path/to/your/logo.png" alt="Rock4Code Logo" width={32} height={32} /> */}
        <span className="text-xl font-bold text-gray-100">R</span> {/* Simplemente una 'R' grande como en tu imagen */}
        <span className="text-xl font-semibold text-gray-100">Rock4Code</span>
      </div>

      {/* Sección central: Enlaces de navegación */}
      <ul className="flex space-x-6 text-gray-300">
        <li>
          <Link href="/productos" className="hover:text-white transition-colors duration-200">
            Productos
          </Link>
        </li>
        <li>
          <Link href="/categorias" className="hover:text-white transition-colors duration-200">
            Categorías
          </Link>
        </li>
        <li>
          <Link href="/nosotros" className="hover:text-white transition-colors duration-200">
            Nosotros
          </Link>
        </li>
        <li>
          <Link href="/contacto" className="hover:text-white transition-colors duration-200">
            Contacto
          </Link>
        </li>
      </ul>

      {/* Sección derecha: Botón "Ver Catálogo" */}
      <div>
        <Link href="/catalogo">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Ver Catálogo
          </button>
        </Link>
      </div>
    </nav>
  );
}