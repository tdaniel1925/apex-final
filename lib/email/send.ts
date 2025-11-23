import { resend, FROM_EMAIL } from './resend'
import WelcomeEmail from '@/emails/welcome'
import CommissionEarnedEmail from '@/emails/commission-earned'
import PayoutProcessedEmail from '@/emails/payout-processed'

export async function sendWelcomeEmail({
  to,
  firstName,
  loginUrl,
  sponsorName,
}: {
  to: string
  firstName: string
  loginUrl: string
  sponsorName?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to Apex MLM!',
      react: WelcomeEmail({ firstName, loginUrl, sponsorName }),
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

export async function sendCommissionEarnedEmail({
  to,
  firstName,
  amount,
  commissionType,
  fromUser,
  dashboardUrl,
}: {
  to: string
  firstName: string
  amount: string
  commissionType: string
  fromUser?: string
  dashboardUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You earned ${amount} in commissions!`,
      react: CommissionEarnedEmail({
        firstName,
        amount,
        commissionType,
        fromUser,
        dashboardUrl,
      }),
    })

    if (error) {
      console.error('Error sending commission email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending commission email:', error)
    return { success: false, error }
  }
}

export async function sendPayoutProcessedEmail({
  to,
  firstName,
  amount,
  batchNumber,
  commissionCount,
  dashboardUrl,
}: {
  to: string
  firstName: string
  amount: string
  batchNumber: string
  commissionCount: number
  dashboardUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your payout of ${amount} has been processed!`,
      react: PayoutProcessedEmail({
        firstName,
        amount,
        batchNumber,
        commissionCount,
        dashboardUrl,
      }),
    })

    if (error) {
      console.error('Error sending payout email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending payout email:', error)
    return { success: false, error }
  }
}
