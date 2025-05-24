import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'

export default function GuestRoute({ children }: { children: ReactNode }) {
  const authContext = useAuth()
  const router = useRouter()

  const [render, setRender] = useState<boolean>(false)

  useEffect(() => {
    if (authContext.isAuthenticated) {
      router.replace('/') // redirect to login if not authenticated
      setRender(true)
    }
    setRender(true)
  }, [authContext.isAuthenticated])

  if (render && !authContext.isAuthenticated) return (
    <>{children}</>
  )

  return (
    <div className='bg-white min-h-svh flex justify-center items-center'>
      <p>Authenticating...</p>
    </div>
  )
}
