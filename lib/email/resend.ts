import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@apexmlm.com'
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@apexmlm.com'
