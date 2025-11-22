/**
 * Rank System Service
 *
 * Implements the 6-tier rank system with automatic qualification checking
 * and advancement logic.
 *
 * Rank Structure:
 * 1. Distributor (default)
 * 2. Bronze ($500/month personal sales, 3 active legs)
 * 3. Silver ($2000/month personal sales, 5 active legs, $5000 team volume)
 * 4. Gold ($5000/month personal sales, 5 active legs, $20000 team volume)
 * 5. Platinum ($10000/month personal sales, 5 active legs, $50000 team volume, 2 Gold legs)
 * 6. Diamond ($20000/month personal sales, 5 active legs, $100000 team volume, 3 Platinum legs)
 * 7. Presidential ($50000/month personal sales, 5 active legs, $250000 team volume, 5 Diamond legs)
 */

import { db } from '@/lib/db'
import { users, orders, matrixPositions } from '@/lib/db/schema'
import { eq, and, gte, sql } from 'drizzle-orm'
import { getDownlinePositions } from './matrix-placement'

// Rank definitions
export const RANKS = {
  distributor: {
    id: 'distributor',
    name: 'Distributor',
    level: 0,
    bonus: 0,
    requirements: {
      personalSales: 0,
      activeLegs: 0,
      teamVolume: 0,
      qualifiedLegs: {},
    },
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    level: 1,
    bonus: 100,
    requirements: {
      personalSales: 500,
      activeLegs: 3,
      teamVolume: 0,
      qualifiedLegs: {},
    },
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    level: 2,
    bonus: 500,
    requirements: {
      personalSales: 2000,
      activeLegs: 5,
      teamVolume: 5000,
      qualifiedLegs: {},
    },
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    level: 3,
    bonus: 2000,
    requirements: {
      personalSales: 5000,
      activeLegs: 5,
      teamVolume: 20000,
      qualifiedLegs: {},
    },
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    level: 4,
    bonus: 10000,
    requirements: {
      personalSales: 10000,
      activeLegs: 5,
      teamVolume: 50000,
      qualifiedLegs: {
        gold: 2, // Requires 2 Gold-ranked legs
      },
    },
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    level: 5,
    bonus: 50000,
    requirements: {
      personalSales: 20000,
      activeLegs: 5,
      teamVolume: 100000,
      qualifiedLegs: {
        platinum: 3, // Requires 3 Platinum-ranked legs
      },
    },
  },
  presidential: {
    id: 'presidential',
    name: 'Presidential',
    level: 6,
    bonus: 100000,
    requirements: {
      personalSales: 50000,
      activeLegs: 5,
      teamVolume: 250000,
      qualifiedLegs: {
        diamond: 5, // Requires 5 Diamond-ranked legs
      },
    },
  },
} as const

export type RankId = keyof typeof RANKS

export interface RankQualification {
  qualified: boolean
  currentStats: {
    personalSales: number
    activeLegs: number
    teamVolume: number
    qualifiedLegCounts: Record<string, number>
  }
  requirements: {
    personalSales: number
    activeLegs: number
    teamVolume: number
    qualifiedLegs: Record<string, number>
  }
  missing: {
    personalSales: number
    activeLegs: number
    teamVolume: number
    qualifiedLegs: Record<string, number>
  }
}

/**
 * Calculate personal sales for a user in the current month
 */
export async function getPersonalSales(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  // Default to current month
  const now = new Date()
  const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1)
  const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const userOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.distributorId, userId),
        gte(orders.createdAt, start),
        sql`${orders.createdAt} <= ${end}`,
        eq(orders.paymentStatus, 'paid')
      )
    )

  return userOrders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0)
}

/**
 * Calculate team volume for a user (all downline sales)
 */
export async function getTeamVolume(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  const now = new Date()
  const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1)
  const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Get all downline positions
  const downline = await getDownlinePositions(userId, 9)
  const downlineIds = downline.map((pos) => pos.userId)

  if (downlineIds.length === 0) {
    return 0
  }

  // Get all orders from downline in the period
  const downlineOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        sql`${orders.distributorId} = ANY(${downlineIds})`,
        gte(orders.createdAt, start),
        sql`${orders.createdAt} <= ${end}`,
        eq(orders.paymentStatus, 'paid')
      )
    )

  return downlineOrders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0)
}

/**
 * Get count of active legs (first-level positions with activity)
 */
export async function getActiveLegs(userId: string): Promise<number> {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)

  // Get direct downline (level 1)
  const directDownline = await db
    .select()
    .from(matrixPositions)
    .where(and(eq(matrixPositions.parentId, userId), eq(matrixPositions.level, 2)))

  let activeLegCount = 0

  for (const leg of directDownline) {
    // Check if this leg or anyone in their downline has orders this month
    const legOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.distributorId, leg.userId),
          gte(orders.createdAt, start),
          eq(orders.paymentStatus, 'paid')
        )
      )
      .limit(1)

    if (legOrders.length > 0) {
      activeLegCount++
    }
  }

  return activeLegCount
}

/**
 * Get count of qualified legs by rank
 */
export async function getQualifiedLegCounts(userId: string): Promise<Record<string, number>> {
  // Get direct downline (level 1)
  const directDownline = await db
    .select()
    .from(matrixPositions)
    .where(and(eq(matrixPositions.parentId, userId), eq(matrixPositions.level, 2)))

  const counts: Record<string, number> = {}

  for (const leg of directDownline) {
    const [legUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, leg.userId))
      .limit(1)

    if (legUser && legUser.rankId) {
      counts[legUser.rankId] = (counts[legUser.rankId] || 0) + 1
    }
  }

  return counts
}

/**
 * Check if user qualifies for a specific rank
 */
export async function checkRankQualification(
  userId: string,
  rankId: RankId
): Promise<RankQualification> {
  const rank = RANKS[rankId]
  const requirements = rank.requirements

  // Get current stats
  const [personalSales, teamVolume, activeLegs, qualifiedLegCounts] = await Promise.all([
    getPersonalSales(userId),
    getTeamVolume(userId),
    getActiveLegs(userId),
    getQualifiedLegCounts(userId),
  ])

  const currentStats = {
    personalSales,
    activeLegs,
    teamVolume,
    qualifiedLegCounts,
  }

  // Check all requirements
  let qualified = true
  const missing: RankQualification['missing'] = {
    personalSales: 0,
    activeLegs: 0,
    teamVolume: 0,
    qualifiedLegs: {},
  }

  // Check personal sales
  if (personalSales < requirements.personalSales) {
    qualified = false
    missing.personalSales = requirements.personalSales - personalSales
  }

  // Check active legs
  if (activeLegs < requirements.activeLegs) {
    qualified = false
    missing.activeLegs = requirements.activeLegs - activeLegs
  }

  // Check team volume
  if (teamVolume < requirements.teamVolume) {
    qualified = false
    missing.teamVolume = requirements.teamVolume - teamVolume
  }

  // Check qualified leg requirements
  for (const [requiredRank, requiredCount] of Object.entries(requirements.qualifiedLegs)) {
    const currentCount = qualifiedLegCounts[requiredRank] || 0
    if (currentCount < requiredCount) {
      qualified = false
      missing.qualifiedLegs[requiredRank] = requiredCount - currentCount
    }
  }

  return {
    qualified,
    currentStats,
    requirements: {
      personalSales: requirements.personalSales,
      activeLegs: requirements.activeLegs,
      teamVolume: requirements.teamVolume,
      qualifiedLegs: requirements.qualifiedLegs,
    },
    missing,
  }
}

/**
 * Find the highest rank a user qualifies for
 */
export async function getHighestQualifiedRank(userId: string): Promise<RankId> {
  const rankOrder: RankId[] = [
    'presidential',
    'diamond',
    'platinum',
    'gold',
    'silver',
    'bronze',
    'distributor',
  ]

  for (const rankId of rankOrder) {
    const qualification = await checkRankQualification(userId, rankId)
    if (qualification.qualified) {
      return rankId
    }
  }

  return 'distributor'
}

/**
 * Process rank advancement for a user
 * Returns the new rank if advanced, null if no change
 */
export async function processRankAdvancement(
  userId: string
): Promise<{ advanced: boolean; oldRank: string; newRank: string; bonus?: number } | null> {
  // Get current rank
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    return null
  }

  const currentRankId = (user.rankId || 'distributor') as RankId
  const qualifiedRankId = await getHighestQualifiedRank(userId)

  const currentLevel = RANKS[currentRankId].level
  const qualifiedLevel = RANKS[qualifiedRankId].level

  // Check if advancement occurred
  if (qualifiedLevel > currentLevel) {
    // Update user rank
    await db.update(users).set({ rankId: qualifiedRankId }).where(eq(users.id, userId))

    return {
      advanced: true,
      oldRank: currentRankId,
      newRank: qualifiedRankId,
      bonus: RANKS[qualifiedRankId].bonus,
    }
  }

  return null
}

/**
 * Get rank statistics for a user
 */
export async function getRankStats(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    return null
  }

  const currentRankId = (user.rankId || 'distributor') as RankId
  const currentRank = RANKS[currentRankId]

  // Get qualification status for current and next rank
  const currentQualification = await checkRankQualification(userId, currentRankId)

  // Find next rank
  const nextRankId =
    currentRank.level < 6
      ? (Object.values(RANKS).find((r) => r.level === currentRank.level + 1)?.id as RankId)
      : null

  const nextQualification = nextRankId
    ? await checkRankQualification(userId, nextRankId)
    : null

  return {
    currentRank: {
      id: currentRankId,
      name: currentRank.name,
      level: currentRank.level,
    },
    currentQualification,
    nextRank: nextRankId
      ? {
          id: nextRankId,
          name: RANKS[nextRankId].name,
          level: RANKS[nextRankId].level,
          bonus: RANKS[nextRankId].bonus,
        }
      : null,
    nextQualification,
  }
}
