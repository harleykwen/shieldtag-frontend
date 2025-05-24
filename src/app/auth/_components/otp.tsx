import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { differenceInSeconds } from 'date-fns'

interface OtpProps {
  otp: string
  setOtp: Dispatch<SetStateAction<string>>
  onVerify: () => void
  isVerifying: boolean
  onResend: () => void
  isResending: boolean
  expiredAt: number | undefined
}

export default function Otp(props: OtpProps) {
  const { otp, setOtp, onResend, onVerify, isResending, isVerifying, expiredAt } = props

  const [tempExpiredAt, setTempExpiredAt] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)

  function getSecondsLeft() {
    if (!expiredAt) return 0
    return Math.max(differenceInSeconds(new Date(expiredAt), new Date()), 0)
  }

  useEffect(() => {
    if (!tempExpiredAt) return
    const expiryDate = new Date(tempExpiredAt)
    const updateCountdown = () => {
      const diff = differenceInSeconds(tempExpiredAt, new Date())
      setSecondsLeft(diff > 0 ? diff : 0)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [tempExpiredAt])

  useEffect(() => {
    if (expiredAt) setTempExpiredAt(expiredAt)
  }, [expiredAt])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify OTP</h1>
        <p className="text-balance text-sm text-muted-foreground">
          We've sent an One-Time Password (OTP) to your registered email address. Please check your inbox (and spam folder, just in case)
        </p>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <InputOTP 
          maxLength={6} 
          className='mx-auto' 
          value={otp} 
          onChange={(e) => setOtp(e)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button 
          className="w-full" 
          onClick={onVerify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>
        <Button 
          variant='outline'
          className="w-full" 
          onClick={onResend}
          disabled={isResending || secondsLeft != 0}
        >
          {secondsLeft === 0
            ? `Resend OTP in ${isResending ? '...' : ''}`
            : `Resend OTP in ${formatTime(secondsLeft)}`
          }
        </Button>
      </div>
    </div>
  )
}
