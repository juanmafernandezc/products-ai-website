import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rutas públicas que no requieren autenticación
const isPublicRoute = createRouteMatcher([
  '/',           // Página principal
  '/sign-in(.*)', // Rutas de inicio de sesión
  '/sign-up(.*)', // Rutas de registro
  '/api/public(.*)', // APIs públicas si las tienes
])

// Rutas que requieren autenticación
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Panel de usuario
  '/profile(.*)',   // Perfil de usuario
  '/settings(.*)',  // Configuraciones
  '/orders(.*)',    // Pedidos
  '/api/protected(.*)', // APIs protegidas
])

export default clerkMiddleware(async (auth, req) => {
  // Si la ruta está protegida, requerir autenticación
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  
  // Si no es una ruta pública y no está explícitamente protegida,
  // también requerir autenticación (comportamiento más restrictivo)
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}