'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import authService from '@/services/auth/auth.service'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'
import Otp from '../_components/otp';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha'
import { Eye, EyeOff } from 'lucide-react';
import { getPasswordStrength } from '@/lib/password';
import clsx from 'clsx';

export default function ForgotPassword() {
  const router = useRouter()

  const [isOtp, setIsOtp] = useState<boolean>(false)
  const [isNewPassword, setIsNewPassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const [isVerified, setIsVerified] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const strength = getPasswordStrength(password)

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token)
    setIsVerified(!!token)
  }

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (resp) => {
      toast.success(resp?.message)
      setIsOtp(true)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  const forgotPasswordResendOtpMutation = useMutation({
    mutationFn: authService.forgotPasswordResendOtp,
    onSuccess: (resp) => {
      toast.success(resp?.message)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  const forgotPasswordVerifyMutation = useMutation({
    mutationFn: authService.forgotPasswordVerifyOtp,
    onSuccess: (resp) => {
      toast.success(resp?.message)
      setIsNewPassword(true)
      setIsOtp(false)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  const forgotPasswordResetMutation = useMutation({
    mutationFn: authService.forgotPasswordReset,
    onSuccess: (resp) => {
      toast.success(resp?.message)
      router.replace('/auth/login')
      setIsOtp(false)
      setIsNewPassword(false)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  if (isNewPassword) return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your new password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative w-full max-w-sm">
            <Input
              id="password" 
              type={showPassword ? 'text' : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <div className="space-y-1">
              <div className="h-2 w-full bg-gray-200 rounded">
                {strength === 'Weak'
                  ? <div className="h-2 w-[33%] bg-red-400 rounded" />
                  : strength === 'Medium'
                    ? <div className="h-2 w-[66%] bg-yellow-400 rounded" />
                    : <div className="h-2 w-[100%] bg-green-400 rounded" />
                }
              </div>
              <p className={clsx('text-sm font-medium', {
                'text-red-600': strength === 'Weak',
                'text-yellow-600': strength === 'Medium',
                'text-green-600': strength === 'Strong',
              })}>
                Strength: {strength}
              </p>
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Confirm Password</Label>
          <div className="relative w-full max-w-sm">
            <Input
              id="password" 
              type={showConfirmPassword ? 'text' : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={forgotPasswordResetMutation.isPending}
          onClick={() => {
            if (password !== confirmPassword) return toast.error("Password doesn't match")
            forgotPasswordResetMutation.mutate({
              password: password,
              token: forgotPasswordVerifyMutation?.data?.data?.token??''
            })
          }}
        >
          {forgotPasswordResetMutation.isPending ? 'Resetting...' : 'Reset'}
        </Button>
      </div>
    </div>
  )

  if (isOtp) return (
    <Otp 
      otp={otp} 
      setOtp={setOtp} 
      onVerify={() => {
        forgotPasswordVerifyMutation.mutate({
          otp_id: forgotPasswordResendOtpMutation?.data?.data?.otp_id??forgotPasswordMutation.data?.data.otp_id??'',
          otp: otp
        })
      }}
      onResend={() => {
        forgotPasswordResendOtpMutation?.mutate({
          otp_id: forgotPasswordResendOtpMutation?.data?.data?.otp_id??forgotPasswordMutation.data?.data.otp_id??''
        })
      }}
      isVerifying={forgotPasswordVerifyMutation.isPending}
      isResending={forgotPasswordResendOtpMutation.isPending}
      expiredAt={forgotPasswordResendOtpMutation?.data?.data?.expired_at??forgotPasswordMutation?.data?.data?.expired_at}
    />
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to reset your password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email" 
            type="email"
            placeholder="johndoe@mail.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='flex justify-center items-center'>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={handleCaptchaChange}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={forgotPasswordMutation.isPending || !isVerified || !captchaToken}
          onClick={() => {
            forgotPasswordMutation.mutate({ email })
          }}
        >
          {forgotPasswordMutation.isPending ? 'Requesting OTP...' : 'Request OTP'}
        </Button>
      </div>
    </div>
  )
}
