import DOMPurify from 'isomorphic-dompurify'
import validator from 'validator'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ''

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  })
}

/**
 * Sanitize plain text - strips all HTML tags
 */
export function sanitizeText(text: string): string {
  if (!text) return ''

  // Strip all HTML tags
  const stripped = text.replace(/<[^>]*>/g, '')

  // Escape special characters
  return validator.escape(stripped)
}

/**
 * Sanitize and validate email
 */
export function sanitizeEmail(email: string): string | null {
  if (!email) return null

  const normalized = validator.normalizeEmail(email)
  if (!normalized || !validator.isEmail(normalized)) {
    return null
  }

  return normalized
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null

  // Check if it's a valid URL
  if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
    return null
  }

  return validator.escape(url)
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return ''

  // Remove all non-numeric characters except +
  return phone.replace(/[^\d+]/g, '')
}

/**
 * Sanitize alphanumeric string (for usernames, slugs, etc.)
 */
export function sanitizeAlphanumeric(str: string): string {
  if (!str) return ''

  // Only allow letters, numbers, hyphens, and underscores
  return str.replace(/[^a-zA-Z0-9-_]/g, '')
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(value: string | number): number | null {
  if (value === null || value === undefined || value === '') return null

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num) || !isFinite(num)) return null

  return num
}

/**
 * Sanitize decimal (for monetary values)
 */
export function sanitizeDecimal(value: string | number, decimals = 2): string | null {
  const num = sanitizeNumber(value)
  if (num === null) return null

  return num.toFixed(decimals)
}

/**
 * Sanitize boolean
 */
export function sanitizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1'
  }
  if (typeof value === 'number') {
    return value === 1
  }
  return false
}

/**
 * Sanitize SSN/EIN (Tax ID)
 */
export function sanitizeTaxId(taxId: string): string {
  if (!taxId) return ''

  // Remove all non-numeric characters
  const clean = taxId.replace(/\D/g, '')

  // Validate length (SSN = 9, EIN = 9)
  if (clean.length !== 9) {
    throw new Error('Invalid tax ID format')
  }

  return clean
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return ''

  // Remove path components
  const baseName = fileName.split(/[/\\]/).pop() || ''

  // Remove dangerous characters
  return baseName.replace(/[^a-zA-Z0-9._-]/g, '_')
}

/**
 * Sanitize JSON input
 */
export function sanitizeJson<T = any>(jsonString: string): T | null {
  if (!jsonString) return null

  try {
    const parsed = JSON.parse(jsonString)

    // Recursively sanitize string values in the object
    const sanitized = sanitizeObject(parsed)

    return sanitized as T
  } catch (error) {
    console.error('Invalid JSON:', error)
    return null
  }
}

/**
 * Recursively sanitize all string values in an object
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeText(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key])
      }
    }
    return sanitized
  }

  return obj
}

/**
 * Sanitize user-generated content (for bios, descriptions, etc.)
 */
export function sanitizeUserContent(content: string, maxLength = 5000): string {
  if (!content) return ''

  // Trim whitespace
  let sanitized = content.trim()

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  // Sanitize HTML
  sanitized = sanitizeHtml(sanitized)

  return sanitized
}
