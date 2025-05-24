import { BaseResponse } from "../base.type"

/**
 * Register
 */

export interface RegisterPayloadProps {
  email: string
  password: string
}

export interface RegisterProps extends BaseResponse {
  data: {
    otp_id: string
    expired_at: number
  }
}

/**
 * Register Verify OTP
 */

export interface RegisterVerifyOtpPayloadProps {
  otp: string
  otp_id: string
}

export interface RegisterVerifyOtpProps extends BaseResponse {
  data: null
}

/**
 * Register Resend OTP
 */

export interface RegisterResendOtpPayloadProps {
  otp_id: string
}

export interface RegisterResendOtpProps extends BaseResponse {
  data: {
    otp_id: string
    expired_at: number
  }
}

/**
 * Login
 */

export interface LoginPayloadProps {
  email: string
  password: string
}

export interface LoginProps extends BaseResponse {
  data: {
    otp_id: string
    expired_at: number
  }
}

/**
 * Login Verify OTP
 */

export interface LoginVerifyOtpPayloadProps {
  otp: string
  otp_id: string
}

export interface LoginVerifyOtpProps extends BaseResponse {
  data: {
    token: string
  }
}

/**
 * Login Resend OTP
 */

export interface LoginResendOtpPayloadProps {
  otp_id: string
}

export interface LoginResendOtpProps extends BaseResponse {
  data: {
    otp_id: string
    expired_at: number
  }
}

/**
 * Forgot Password Request OTP
 */

export interface ForgotPasswordPayloadProps {
  email: string
}

export interface ForgotPasswordProps extends BaseResponse {
  data: {
    otp_id: string
    expired_at: number
  }
}

/**
 * Forgot Password Verify OTP
 */

export interface ForgotPasswordVerifyOtpPayloadProps {
  otp: string
  otp_id: string
}

export interface ForgotPasswordVerifyOtpProps extends BaseResponse {
  data: {
    token: string
  }
}

/**
 * Forgot Password Resend OTP
 */

export interface ForgotPasswordResendOtpPayloadProps {
  otp_id: string
}

export interface ForgotPasswordResendOtpProps extends BaseResponse {
  data: {
    otp_id: string
    expired_at: number
  }
}

/**
 * Forgot Password Reset
 */

export interface ForgotPasswordResetOtpPayloadProps {
  password: string
  token: string
}

export interface ForgotPasswordResetOtpProps extends BaseResponse {
  data: null
}