export function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return 'Weak'
  if (score === 2 || score === 3) return 'Medium'
  return 'Strong'
}

export function getStrengthColor(strength: string) {
  if (strength === 'Weak') return 'bg-red-500'
  if (strength === 'Medium') return 'bg-yellow-500'
  return 'bg-green-500'
}