'use client';

import React from 'react'
import GuestRoute from '../GuestRoute';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestRoute>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              {children}
            </div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <Image
            src="/logo.svg"
            width={100}
            height={100}
            alt="Image"
            className="absolute m-auto inset-0 w-[300px] object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </GuestRoute>
  )
}
