export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="ml-3 text-xl font-bold text-white">Rock4Code</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 Rock4Code. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}