'use client'

import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import profileService from '@/services/profile/profile.service'

interface AuthContextType {
  user: { email: string } | undefined
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.profile,
  })

  if (profileQuery.isFetching) {
    return (
      <div className='bg-white min-h-svh flex justify-center items-center'>
        <p>Authenticating...</p>
      </div>
    )
  }

  const user = profileQuery.data?.data
  const isAuthenticated = !!user?.email

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
