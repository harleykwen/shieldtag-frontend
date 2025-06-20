"use client";

import { useAuth } from '@/context/AuthContext'
import React from 'react'
import ProtectedRoute from './ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  const authContext = useAuth()

  return (
    <ProtectedRoute>
      <div className='bg-white min-h-svh flex flex-col justify-center items-center'>
        <p>You logged in as <b>{authContext.user?.email}</b></p>
        <p
          className='underline text-red-600 mt-5 cursor-pointer'
          onClick={() => {
            document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`
            authContext.authenticate()
            router.replace('/auth/login')
          }}
        >Logout</p>
      </div>
    </ProtectedRoute>
  )
}
