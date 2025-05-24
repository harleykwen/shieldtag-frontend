import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const authContext = useAuth()

  const [render, setRender] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    if (!authContext.isAuthenticated) {
      router.replace('/auth/login') // redirect to login if not authenticated
      setRender(true)
    }
    setRender(true)
  }, [authContext.isAuthenticated, router])

  if (render && authContext.isAuthenticated) return (
    <>{children}</>
  )

  return (
    <div className='bg-white min-h-svh flex justify-center items-center'>
      <p>Authenticating...</p>
    </div>
  )
}
