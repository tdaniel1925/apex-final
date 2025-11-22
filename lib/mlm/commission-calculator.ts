/**
 * Commission Calculator Service
 *
 * Implements 4 types of commissions:
 * 1. Retail Commission (25% of order total)
 * 2. Matrix Commissions (9 levels, decreasing percentages)
 * 3. Rank Achievement Bonuses (one-time bonuses for rank advancement)
 * 4. Matching Bonuses (5 levels, percentage of downline commissions)
 *
 * Commission Rates:
 * - Retail: 25% of commissionable value
 * - Matrix Level 1: 10%
 * - Matrix Level 2: 5%
 * - Matrix Level 3: 5%
 * - Matrix Level 4: 3%
 * - Matrix Level 5: 3%
 * - Matrix Level 6: 2%
 * - Matrix Level 7: 2%
 * - Matrix Level 8: 1%
 * - Matrix Level 9: 1%
 * - Matching Bonus: 10% of downline's commissions (5 levels up)
 */

import { db } from '@/lib/db'
import { commissions, orders, orderItems, users } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getUplinePositions } from './matrix-placement'

// Commission rates by level
const MATRIX_COMMISSION_RATES: Record<number, number> = {
  1: 0.10, // 10%
  2: 0.05, // 5%
  3: 0.05, // 5%
  4: 0.03, // 3%
  5: 0.03, // 3%
  6: 0.02, // 2%
  7: 0.02, // 2%
  8: 0.01, // 1%
  9: 0.01, // 1%
}

const RETAIL_COMMISSION_RATE = 0.25 // 25%
const MATCHING_BONUS_RATE = 0.10 // 10%
const MATCHING_BONUS_LEVELS = 5

export interface CommissionCalculation {
  userId: string
  fromUserId: string
  orderId: string
  type: 'retail' | 'matrix' | 'rank_bonus' | 'matching'
  amount: number
  level?: number
  description: string
}

/**
 * Calculate retail commission for the distributor who made the sale
 */
export async function calculateRetailCommission(
  orderId: string,
  distributorId: string,
  customerId: string
): Promise<CommissionCalculation | null> {
  try {
    // Get order items to calculate commissionable value
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    if (items.length === 0) {
      return null
    }

    // Sum up commissionable values
    const totalCommissionable = items.reduce((sum, item) => {
      return sum + parseFloat(item.commissionableValue || '0')
    }, 0)

    const commissionAmount = totalCommissionable * RETAIL_COMMISSION_RATE

    return {
      userId: distributorId,
      fromUserId: customerId,
      orderId,
      type: 'retail',
      amount: commissionAmount,
      description: `Retail commission (25%) on order total`,
    }
  } catch (error) {
    console.error('Error calculating retail commission:', error)
    return null
  }
}

/**
 * Calculate matrix commissions for upline distributors (9 levels)
 */
export async function calculateMatrixCommissions(
  orderId: string,
  distributorId: string,
  customerId: string
): Promise<CommissionCalculation[]> {
  const matrixCommissions: CommissionCalculation[] = []

  try {
    // Get order items to calculate commissionable value
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    if (items.length === 0) {
      return matrixCommissions
    }

    const totalCommissionable = items.reduce((sum, item) => {
      return sum + parseFloat(item.commissionableValue || '0')
    }, 0)

    // Get upline positions (9 levels)
    const upline = await getUplinePositions(distributorId, 9)

    // Calculate commission for each upline level
    for (let i = 0; i < upline.length; i++) {
      const level = i + 1
      const uplineUser = upline[i]
      const rate = MATRIX_COMMISSION_RATES[level] || 0

      if (rate > 0) {
        // Check if upline user is active and qualified
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, uplineUser.userId))
          .limit(1)

        // Skip inactive or unqualified distributors
        if (!user || user.status !== 'active') {
          continue
        }

        // TODO: Add autoship requirement check
        // For now, all active users qualify

        const commissionAmount = totalCommissionable * rate

        matrixCommissions.push({
          userId: uplineUser.userId,
          fromUserId: customerId,
          orderId,
          type: 'matrix',
          amount: commissionAmount,
          level,
          description: `Matrix Level ${level} commission (${(rate * 100).toFixed(0)}%)`,
        })
      }
    }

    return matrixCommissions
  } catch (error) {
    console.error('Error calculating matrix commissions:', error)
    return matrixCommissions
  }
}

/**
 * Calculate matching bonuses (10% of downline commissions, 5 levels)
 */
export async function calculateMatchingBonuses(
  commissionId: string,
  earnerId: string,
  commissionAmount: number
): Promise<CommissionCalculation[]> {
  const matchingBonuses: CommissionCalculation[] = []

  try {
    // Get commission details
    const [commission] = await db
      .select()
      .from(commissions)
      .where(eq(commissions.id, commissionId))
      .limit(1)

    if (!commission) {
      return matchingBonuses
    }

    // Only match on matrix and retail commissions
    if (commission.type !== 'matrix' && commission.type !== 'retail') {
      return matchingBonuses
    }

    // Get upline for matching bonuses (5 levels)
    const upline = await getUplinePositions(earnerId, MATCHING_BONUS_LEVELS)

    for (let i = 0; i < upline.length; i++) {
      const level = i + 1
      const uplineUser = upline[i]

      // Check if upline user is active and qualified for matching bonuses
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, uplineUser.userId))
        .limit(1)

      // Skip inactive distributors
      if (!user || user.status !== 'active') {
        continue
      }

      // TODO: Add rank requirement for matching bonuses
      // Typically, only certain ranks qualify for matching bonuses
      // For now, all active users qualify

      const matchingAmount = commissionAmount * MATCHING_BONUS_RATE

      matchingBonuses.push({
        userId: uplineUser.userId,
        fromUserId: earnerId,
        orderId: commission.orderId || '',
        type: 'matching',
        amount: matchingAmount,
        level,
        description: `Matching Bonus Level ${level} (${(MATCHING_BONUS_RATE * 100).toFixed(0)}%)`,
      })
    }

    return matchingBonuses
  } catch (error) {
    console.error('Error calculating matching bonuses:', error)
    return matchingBonuses
  }
}

/**
 * Calculate rank achievement bonus
 */
export async function calculateRankBonus(
  userId: string,
  newRankId: string
): Promise<CommissionCalculation | null> {
  try {
    // Rank bonuses (one-time payments)
    const RANK_BONUSES: Record<string, number> = {
      'bronze': 100,
      'silver': 500,
      'gold': 2000,
      'platinum': 10000,
      'diamond': 50000,
      'presidential': 100000,
    }

    // Get the latest order for this user (to associate commission)
    const latestOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(1)

    if (latestOrder.length === 0) {
      return null
    }

    const bonusAmount = RANK_BONUSES[newRankId] || 0

    if (bonusAmount === 0) {
      return null
    }

    return {
      userId,
      fromUserId: userId, // Rank bonus is self-earned
      orderId: latestOrder[0].id,
      type: 'rank_bonus',
      amount: bonusAmount,
      description: `${newRankId.charAt(0).toUpperCase() + newRankId.slice(1)} Rank Achievement Bonus`,
    }
  } catch (error) {
    console.error('Error calculating rank bonus:', error)
    return null
  }
}

/**
 * Process all commissions for an order
 * This is the main entry point called when an order is completed
 */
export async function processOrderCommissions(
  orderId: string,
  distributorId: string,
  customerId?: string
): Promise<{ success: boolean; commissionsCreated: number; totalAmount: number; error?: string }> {
  try {
    const allCommissions: CommissionCalculation[] = []

    // Use customerId if provided, otherwise use distributorId (for self-purchases)
    const fromUserId = customerId || distributorId

    // 1. Calculate retail commission for the selling distributor
    const retailComm = await calculateRetailCommission(orderId, distributorId, fromUserId)
    if (retailComm) {
      allCommissions.push(retailComm)
    }

    // 2. Calculate matrix commissions for upline (9 levels)
    const matrixComms = await calculateMatrixCommissions(orderId, distributorId, fromUserId)
    allCommissions.push(...matrixComms)

    // 3. Save all commissions to database
    const createdCommissions = []
    for (const comm of allCommissions) {
      const [created] = await db
        .insert(commissions)
        .values({
          userId: comm.userId,
          fromUserId: comm.fromUserId,
          orderId: comm.orderId,
          type: comm.type,
          amount: comm.amount.toFixed(2),
          level: comm.level,
          description: comm.description,
          status: 'pending', // Requires admin approval before payout
        })
        .returning()

      createdCommissions.push(created)

      // 4. Calculate matching bonuses for this commission
      if (comm.type === 'retail' || comm.type === 'matrix') {
        const matchingBonuses = await calculateMatchingBonuses(
          created.id,
          comm.userId,
          comm.amount
        )

        for (const matching of matchingBonuses) {
          const [matchingComm] = await db
            .insert(commissions)
            .values({
              userId: matching.userId,
              fromUserId: matching.fromUserId,
              orderId: matching.orderId,
              type: matching.type,
              amount: matching.amount.toFixed(2),
              level: matching.level,
              description: matching.description,
              status: 'pending',
            })
            .returning()

          createdCommissions.push(matchingComm)
        }
      }
    }

    const totalAmount = createdCommissions.reduce(
      (sum, comm) => sum + parseFloat(comm.amount),
      0
    )

    return {
      success: true,
      commissionsCreated: createdCommissions.length,
      totalAmount,
    }
  } catch (error) {
    console.error('Error processing order commissions:', error)
    return {
      success: false,
      commissionsCreated: 0,
      totalAmount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get commission summary for a user
 */
export async function getUserCommissionSummary(userId: string) {
  const userCommissions = await db
    .select()
    .from(commissions)
    .where(eq(commissions.userId, userId))

  const summary = {
    total: 0,
    pending: 0,
    approved: 0,
    paid: 0,
    byType: {
      retail: 0,
      matrix: 0,
      rank_bonus: 0,
      matching: 0,
    },
  }

  for (const comm of userCommissions) {
    const amount = parseFloat(comm.amount)
    summary.total += amount

    if (comm.status === 'pending') summary.pending += amount
    if (comm.status === 'approved') summary.approved += amount
    if (comm.status === 'paid') summary.paid += amount

    if (comm.type in summary.byType) {
      summary.byType[comm.type as keyof typeof summary.byType] += amount
    }
  }

  return summary
}
