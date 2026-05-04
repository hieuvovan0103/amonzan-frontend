export function normalizePhoneNumber(rawPhoneNumber: string) {
  const trimmedPhone = rawPhoneNumber.trim()

  if (!trimmedPhone) return null

  if (trimmedPhone.startsWith('+')) {
    const digits = trimmedPhone.slice(1).replace(/\D/g, '')
    if (!digits || digits.length < 8 || digits.length > 15) {
      return null
    }

    return `+${digits}`
  }

  let digits = trimmedPhone.replace(/\D/g, '')

  if (digits.startsWith('84')) {
    digits = digits.slice(2)
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  if (!digits || digits.length < 8 || digits.length > 11) {
    return null
  }

  return `+84${digits}`
}
