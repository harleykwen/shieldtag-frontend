import httpInstance from "../config"
import { ForgotPasswordPayloadProps, ForgotPasswordProps, ForgotPasswordResendOtpPayloadProps, ForgotPasswordResendOtpProps, ForgotPasswordResetOtpPayloadProps, ForgotPasswordResetOtpProps, ForgotPasswordVerifyOtpPayloadProps, ForgotPasswordVerifyOtpProps, LoginPayloadProps, LoginProps, LoginResendOtpPayloadProps, LoginResendOtpProps, LoginVerifyOtpPayloadProps, LoginVerifyOtpProps, RegisterPayloadProps, RegisterProps, RegisterResendOtpPayloadProps, RegisterResendOtpProps, RegisterVerifyOtpPayloadProps, RegisterVerifyOtpProps } from "./auth.service.type"

const authService = {
  register: async (body: RegisterPayloadProps) => {
    const request = await httpInstance.post<RegisterProps>('/auth/register', body)
    if (request.data.error) throw request.data
    return request.data
  },
  registerVerifyOtp: async (body: RegisterVerifyOtpPayloadProps) => {
    const request = await httpInstance.post<RegisterVerifyOtpProps>('/auth/register/verify', body)
    if (request.data.error) throw request.data
    return request.data
  },
  registerResendOtp: async (body: RegisterResendOtpPayloadProps) => {
    const request = await httpInstance.post<RegisterResendOtpProps>('/auth/register/resend-otp', body)
    if (request.data.error) throw request.data
    return request.data
  },
  login: async (body: LoginPayloadProps) => {
    const request = await httpInstance.post<LoginProps>('/auth/login', body)
    if (request.data.error) throw request.data
    return request.data
  },
  loginVerifyOtp: async (body: LoginVerifyOtpPayloadProps) => {
    const request = await httpInstance.post<LoginVerifyOtpProps>('/auth/login/verify', body)
    if (request.data.error) throw request.data
    return request.data
  },
  loginResendOtp: async (body: LoginResendOtpPayloadProps) => {
    const request = await httpInstance.post<LoginResendOtpProps>('/auth/login/resend-otp', body)
    if (request.data.error) throw request.data
    return request.data
  },
  forgotPassword: async (body: ForgotPasswordPayloadProps) => {
    const request = await httpInstance.post<ForgotPasswordProps>('/auth/forgot-password', body)
    if (request.data.error) throw request.data
    return request.data
  },
  forgotPasswordVerifyOtp: async (body: ForgotPasswordVerifyOtpPayloadProps) => {
    const request = await httpInstance.post<ForgotPasswordVerifyOtpProps>('/auth/forgot-password/verify', body)
    if (request.data.error) throw request.data
    return request.data
  },
  forgotPasswordResendOtp: async (body: ForgotPasswordResendOtpPayloadProps) => {
    const request = await httpInstance.post<ForgotPasswordResendOtpProps>('/auth/forgot-password/resend-otp', body)
    if (request.data.error) throw request.data
    return request.data
  },
  forgotPasswordReset: async (body: ForgotPasswordResetOtpPayloadProps) => {
    const request = await httpInstance.post<ForgotPasswordResetOtpProps>('/auth/forgot-password/reset', body)
    if (request.data.error) throw request.data
    return request.data
  },
}

export default authService