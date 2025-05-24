import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const httpInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
})

function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === name) {
      return decodeURIComponent(value)
    }
  }
  return null
}

// Add a request interceptor
httpInstance.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
  // Do something before request is sent
  const token = getCookie('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token // Put token here
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
httpInstance.interceptors.response.use(function (response: AxiosResponse) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status === 401) {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`
  }
  return Promise.reject(error.response.data)
})

export default httpInstance