import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract and trim a string value from FormData.
 * Returns empty string if key is missing.
 */
export function getFormString(formData: FormData, key: string): string {
  return (formData.get(key) as string)?.trim() || ''
}

/**
 * Get initials from a name string (max 2 chars).
 * Example: "Ritik Kumar" → "RK"
 */
export function getInitials(name: string): string {
  return name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}
export function getWhatsAppUrl(phone: string | undefined | null, message: string): string {
  if (!phone) return '#'

  // Remove all non-numeric characters
  let cleanPhone = phone.replace(/\D/g, '')

  // Remove leading 0
  if (cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.substring(1)
  }

  // If length is 10 (standard Indian number), add 91
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone
  }

  // Basic validation: must be at least 10 digits
  if (cleanPhone.length < 10) {
    console.warn(`Invalid phone number for WhatsApp: ${phone}`)
    return '#'
  }

  return `https://web.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`
}
