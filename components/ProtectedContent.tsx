'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedContentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export default function ProtectedContent({ 
  children, 
  fallback = <div>Loading...</div>,
  redirectTo = '/sign-in'
}: ProtectedContentProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectTo)
    }
  }, [isLoaded, isSignedIn, router, redirectTo])

  // Mostrar loading mientras se carga
  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
    </div>
  }

  // Si no está autenticado, mostrar fallback o nada
  if (!isSignedIn) {
    return <>{fallback}</>
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
}

// Hook personalizado para usar en cualquier componente
export function useRequireAuth(redirectTo: string = '/sign-in') {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectTo)
    }
  }, [isLoaded, isSignedIn, router, redirectTo])

  return { isLoaded, isSignedIn }
}