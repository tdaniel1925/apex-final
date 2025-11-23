/**
 * Payout retry handler with exponential backoff
 * Handles automatic retries and manual reconciliation tracking
 */

import { db } from '@/lib/db'
import { payments } from '@/lib/db/schema'
import { eq, and, lte, isNull, or } from 'drizzle-orm'
import { auditPayoutRetry, auditPayoutManualReview } from '@/lib/audit/logger'

export interface RetryConfig {
  maxRetries: number
  baseDelayMinutes: number // Base delay for exponential backoff
  maxDelayMinutes: number // Maximum delay cap
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMinutes: 30, // Start with 30 minutes
  maxDelayMinutes: 1440, // Cap at 24 hours
}

/**
 * Calculate next retry time using exponential backoff
 */
export function calculateNextRetryTime(
  retryCount: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Date {
  const delayMinutes = Math.min(
    config.baseDelayMinutes * Math.pow(2, retryCount),
    config.maxDelayMinutes
  )

  const nextRetry = new Date()
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes)
  return nextRetry
}

/**
 * Mark payment as failed and schedule retry if attempts remain
 */
export async function handlePayoutFailure(
  paymentId: string,
  failureReason: string,
  adminUserId?: string,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
) {
  try {
    // Get current payment
    const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId))

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`)
    }

    const newRetryCount = (payment.retryCount || 0) + 1
    const shouldRetry = newRetryCount < config.maxRetries

    if (shouldRetry) {
      // Schedule next retry with exponential backoff
      const nextRetryAt = calculateNextRetryTime(newRetryCount, config)

      await db
        .update(payments)
        .set({
          status: 'failed',
          stripeFailureReason: failureReason,
          retryCount: newRetryCount,
          lastRetryAt: new Date(),
          nextRetryAt,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, paymentId))

      // Audit log
      await auditPayoutRetry({
        userId: adminUserId,
        paymentId,
        retryCount: newRetryCount,
        nextRetryAt: nextRetryAt.toISOString(),
        reason: failureReason,
      })

      console.log(
        `Payment ${paymentId} failed. Retry ${newRetryCount}/${config.maxRetries} scheduled for ${nextRetryAt.toISOString()}`
      )

      return {
        success: true,
        willRetry: true,
        retryCount: newRetryCount,
        nextRetryAt,
      }
    } else {
      // Max retries exceeded - require manual review
      await db
        .update(payments)
        .set({
          status: 'failed',
          stripeFailureReason: failureReason,
          retryCount: newRetryCount,
          lastRetryAt: new Date(),
          requiresManualReview: 1,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, paymentId))

      // Audit log
      await auditPayoutManualReview({
        userId: adminUserId,
        paymentId,
        reason: `Max retries (${config.maxRetries}) exceeded: ${failureReason}`,
      })

      console.error(
        `Payment ${paymentId} failed after ${newRetryCount} retries. Manual review required.`
      )

      return {
        success: true,
        willRetry: false,
        retryCount: newRetryCount,
        requiresManualReview: true,
      }
    }
  } catch (error) {
    console.error('Error handling payout failure:', error)
    throw error
  }
}

/**
 * Get all payments that are due for retry
 */
export async function getPaymentsDueForRetry() {
  try {
    const now = new Date()

    const duePayments = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.status, 'failed'),
          lte(payments.nextRetryAt, now),
          isNull(payments.requiresManualReview),
          or(isNull(payments.retryCount), lte(payments.retryCount, payments.maxRetries))
        )
      )

    return duePayments
  } catch (error) {
    console.error('Error fetching payments due for retry:', error)
    throw error
  }
}

/**
 * Get all payments requiring manual review
 */
export async function getPaymentsRequiringManualReview() {
  try {
    const manualReviewPayments = await db
      .select()
      .from(payments)
      .where(and(eq(payments.status, 'failed'), eq(payments.requiresManualReview, 1)))

    return manualReviewPayments
  } catch (error) {
    console.error('Error fetching payments requiring manual review:', error)
    throw error
  }
}

/**
 * Reset payment for manual retry by admin
 */
export async function resetPaymentForManualRetry(
  paymentId: string,
  adminUserId: string,
  notes?: string
) {
  try {
    await db
      .update(payments)
      .set({
        status: 'pending',
        retryCount: 0,
        lastRetryAt: null,
        nextRetryAt: null,
        requiresManualReview: 0,
        notes: notes || 'Manually reset by admin for retry',
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId))

    // Audit log
    await auditPayoutRetry({
      userId: adminUserId,
      paymentId,
      retryCount: 0,
      reason: `Manual reset: ${notes || 'Admin initiated retry'}`,
    })

    return { success: true }
  } catch (error) {
    console.error('Error resetting payment for manual retry:', error)
    throw error
  }
}

/**
 * Mark payment as resolved (no retry needed)
 */
export async function markPaymentAsResolved(
  paymentId: string,
  adminUserId: string,
  resolution: string
) {
  try {
    await db
      .update(payments)
      .set({
        status: 'cancelled',
        requiresManualReview: 0,
        notes: `Resolved by admin: ${resolution}`,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId))

    // Audit log
    await auditPayoutManualReview({
      userId: adminUserId,
      paymentId,
      reason: `Resolved: ${resolution}`,
    })

    return { success: true }
  } catch (error) {
    console.error('Error marking payment as resolved:', error)
    throw error
  }
}

/**
 * Get retry statistics for monitoring
 */
export async function getRetryStatistics() {
  try {
    const allFailedPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.status, 'failed'))

    const stats = {
      totalFailed: allFailedPayments.length,
      pendingRetry: allFailedPayments.filter(
        (p) => p.nextRetryAt && new Date(p.nextRetryAt) > new Date() && !p.requiresManualReview
      ).length,
      dueForRetry: allFailedPayments.filter(
        (p) => p.nextRetryAt && new Date(p.nextRetryAt) <= new Date() && !p.requiresManualReview
      ).length,
      requiresManualReview: allFailedPayments.filter((p) => p.requiresManualReview).length,
      byRetryCount: {
        retry1: allFailedPayments.filter((p) => (p.retryCount || 0) === 1).length,
        retry2: allFailedPayments.filter((p) => (p.retryCount || 0) === 2).length,
        retry3: allFailedPayments.filter((p) => (p.retryCount || 0) >= 3).length,
      },
    }

    return stats
  } catch (error) {
    console.error('Error getting retry statistics:', error)
    throw error
  }
}

/**
 * Common Stripe failure reasons and recommended actions
 */
export const STRIPE_FAILURE_REASONS = {
  insufficient_funds: {
    description: 'Bank account has insufficient funds',
    action: 'Contact distributor to update bank account or add funds',
    autoRetry: true,
  },
  account_closed: {
    description: 'Bank account has been closed',
    action: 'Require distributor to update bank account information',
    autoRetry: false,
  },
  no_account: {
    description: 'Bank account number is invalid or does not exist',
    action: 'Require distributor to provide valid bank account',
    autoRetry: false,
  },
  invalid_account_number: {
    description: 'Bank account number is invalid',
    action: 'Require distributor to correct bank account number',
    autoRetry: false,
  },
  debit_not_authorized: {
    description: 'Debit transactions not authorized on this account',
    action: 'Request distributor to authorize debits or use different account',
    autoRetry: false,
  },
  bank_account_restricted: {
    description: 'Bank account has restrictions',
    action: 'Contact distributor to resolve restrictions with their bank',
    autoRetry: true,
  },
  generic_decline: {
    description: 'Transfer was declined by the bank',
    action: 'Contact distributor to check with their bank',
    autoRetry: true,
  },
}

/**
 * Determine if a failure reason should allow automatic retry
 */
export function shouldAutoRetry(failureReason: string): boolean {
  const reason = STRIPE_FAILURE_REASONS[failureReason as keyof typeof STRIPE_FAILURE_REASONS]
  return reason?.autoRetry ?? true // Default to true if reason unknown
}
