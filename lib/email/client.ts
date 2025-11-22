import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn('Resend API key not configured')
}

export const resend = new Resend(resendApiKey)

const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@apex-affinity.com'

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

/**
 * Send a transactional email
 */
export async function sendEmail(template: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error('Email send error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(params: {
  email: string
  firstName: string
  replicatedSiteUrl?: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to Apex Affinity Group!</h1>
      <p>Hi ${params.firstName},</p>
      <p>Thank you for joining Apex Affinity Group. We're excited to have you as part of our community!</p>
      ${
        params.replicatedSiteUrl
          ? `
        <p>Your personal replicated website is ready:</p>
        <p><a href="${params.replicatedSiteUrl}" style="color: #2563eb;">${params.replicatedSiteUrl}</a></p>
      `
          : ''
      }
      <p>Get started by:</p>
      <ul>
        <li>Completing your profile</li>
        <li>Exploring our products</li>
        <li>Setting up your payment information</li>
      </ul>
      <p>If you have any questions, don't hesitate to reach out to our support team.</p>
      <p>Best regards,<br>The Apex Affinity Group Team</p>
    </div>
  `

  return sendEmail({
    to: params.email,
    subject: 'Welcome to Apex Affinity Group!',
    html,
    text: `Hi ${params.firstName}, Thank you for joining Apex Affinity Group!`,
  })
}

/**
 * Send commission payment notification
 */
export async function sendCommissionNotification(params: {
  email: string
  firstName: string
  amount: number
  type: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">New Commission Earned!</h1>
      <p>Hi ${params.firstName},</p>
      <p>Great news! You've earned a new commission.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">
          $${params.amount.toFixed(2)}
        </p>
        <p style="margin: 5px 0 0 0; color: #6b7280;">
          ${params.type} Commission
        </p>
      </div>
      <p>This commission will be included in your next payout.</p>
      <p>Keep up the great work!</p>
      <p>Best regards,<br>The Apex Affinity Group Team</p>
    </div>
  `

  return sendEmail({
    to: params.email,
    subject: 'New Commission Earned!',
    html,
    text: `Hi ${params.firstName}, You've earned a new ${params.type} commission of $${params.amount.toFixed(2)}!`,
  })
}

/**
 * Send payout confirmation
 */
export async function sendPayoutConfirmation(params: {
  email: string
  firstName: string
  amount: number
  date: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Payout Confirmation</h1>
      <p>Hi ${params.firstName},</p>
      <p>Your payout has been processed successfully.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #6b7280;">Amount</p>
        <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">
          $${params.amount.toFixed(2)}
        </p>
        <p style="margin: 10px 0 0 0; color: #6b7280;">
          Processed on ${params.date}
        </p>
      </div>
      <p>Funds should appear in your account within 2-5 business days.</p>
      <p>Best regards,<br>The Apex Affinity Group Team</p>
    </div>
  `

  return sendEmail({
    to: params.email,
    subject: 'Payout Confirmation',
    html,
    text: `Hi ${params.firstName}, Your payout of $${params.amount.toFixed(2)} has been processed on ${params.date}.`,
  })
}
