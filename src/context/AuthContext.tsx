'use client'

import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import profileService from '@/services/profile/profile.service'

interface AuthContextType {
  user: { email: string } | undefined
  isAuthenticated: boolean
  authenticate: () => void
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

  const user = profileQuery?.isSuccess ? profileQuery.data?.data : undefined
  const isAuthenticated = profileQuery?.isSuccess ? !!user?.email : false

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated,
        authenticate: profileQuery?.refetch
      }}
    >
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
