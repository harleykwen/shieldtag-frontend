'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import Otp from "../_components/otp";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginPayloadProps } from "@/services/auth/auth.service.type";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth/auth.service";
import { toast } from "sonner";
import ReCAPTCHA from 'react-google-recaptcha'

export default function Login() {
  const router = useRouter()

  const [isOtp, setIsOtp] = useState<boolean>(false)
  const [otp, setOtp] = useState<string>('')
  const [formData, setFormData] = useState<LoginPayloadProps>({
    email: '',
    password: '',
  })

  const [isVerified, setIsVerified] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token)
    setIsVerified(!!token)
  }

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (resp) => {
      toast.success(resp?.message)
      setIsOtp(true)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  const loginResendOtpMutation = useMutation({
    mutationFn: authService.loginResendOtp,
    onSuccess: (resp) => {
      toast.success(resp?.message)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  const loginVerifyMutation = useMutation({
    mutationFn: authService.loginVerifyOtp,
    onSuccess: async (resp) => {
      toast.success(resp?.message)
      const token = resp?.data?.token
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax; Secure`
      router.replace('/')
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  function handleChangeFormData(key: string, value: string) {
    setFormData((prev) => {
      return {
        ...prev,
        [key]: value
      }
    })
  }

  if (isOtp) return (
    <Otp 
      otp={otp} 
      setOtp={setOtp} 
      onVerify={() => {
        loginVerifyMutation.mutate({
          otp_id: loginResendOtpMutation?.data?.data?.otp_id??loginMutation.data?.data.otp_id??'',
          otp: otp
        })
      }}
      onResend={() => {
        loginResendOtpMutation?.mutate({
          otp_id: loginResendOtpMutation?.data?.data?.otp_id??loginMutation.data?.data.otp_id??''
        })
      }}
      isVerifying={loginVerifyMutation.isPending}
      isResending={loginResendOtpMutation.isPending}
      expiredAt={loginResendOtpMutation?.data?.data?.expired_at??loginMutation?.data?.data?.expired_at}
    />
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            name="email"
            placeholder="johndoe@mail.com" 
            required 
            value={formData.email}
            onChange={(e) => handleChangeFormData(e.target.name, e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            name="password"
            required 
            value={formData.password}
            onChange={(e) => handleChangeFormData(e.target.name, e.target.value)}
          />
        </div>
        <Link href="/auth/forgot-password" className="mx-auto text-sm">
          Forgot Password
        </Link>
        <div className='flex justify-center items-center'>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={handleCaptchaChange}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={!isVerified || !captchaToken || loginMutation.isPending}
          onClick={() => {
            loginMutation.mutate(formData)
          }}
        >
          {loginMutation.isPending ? 'Loging in...' : 'Login'}
        </Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
