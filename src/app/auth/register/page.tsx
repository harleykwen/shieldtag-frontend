'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RegisterPayloadProps } from "@/services/auth/auth.service.type";
import Link from "next/link";
import Otp from "../_components/otp";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth/auth.service";
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import ReCAPTCHA from 'react-google-recaptcha'

export default function Register() {
  const router = useRouter()

  const [isOtp, setIsOtp] = useState<boolean>(false)
  const [otp, setOtp] = useState<string>('')
  const [formData, setFormData] = useState<RegisterPayloadProps>({
    email: '',
    password: '',
  })

  const [isVerified, setIsVerified] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token)
    setIsVerified(!!token)
  }

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (resp) => {
      toast.success(resp?.message)
      setIsOtp(true)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  const registerResendOtpMutation = useMutation({
    mutationFn: authService.registerResendOtp,
    onSuccess: (resp) => {
      toast.success(resp?.message)
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error?.message) ? error?.message[0]?.msg : error?.message
      toast.error(errorMessage)
    }
  })

  const registerVerifyMutation = useMutation({
    mutationFn: authService.registerVerifyOtp,
    onSuccess: (resp) => {
      toast.success(resp?.message)
      router.replace('/auth/login')
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
        registerVerifyMutation.mutate({
          otp_id: registerResendOtpMutation?.data?.data?.otp_id??registerMutation.data?.data.otp_id??'',
          otp: otp
        })
      }}
      onResend={() => {
        registerResendOtpMutation?.mutate({
          otp_id: registerResendOtpMutation?.data?.data?.otp_id??registerMutation.data?.data.otp_id??''
        })
      }}
      isVerifying={registerVerifyMutation.isPending}
      isResending={registerResendOtpMutation.isPending}
      expiredAt={registerResendOtpMutation?.data?.data?.expired_at&&registerMutation?.data?.data?.expired_at}
    />
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill in your details below to join our community!
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
        <div className='flex justify-center items-center'>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={handleCaptchaChange}
          />
        </div>
        <Button 
          className="w-full"
          disabled={!isVerified || !captchaToken || registerMutation.isPending}
          onClick={() => {
            registerMutation.mutate(formData)
          }}
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
        </Button>
        <div className="text-center text-sm">
          Have an account?{" "}
          <Link href="/auth/login" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
