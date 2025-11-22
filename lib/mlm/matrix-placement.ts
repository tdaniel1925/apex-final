/**
 * Matrix Placement Service
 *
 * Implements a 5x9 forced matrix with breadth-first spillover
 * - 5 positions per level (width)
 * - 9 levels deep (depth)
 * - Total possible positions: 5 + 25 + 125 + 625 + 3,125 + 15,625 + 78,125 + 390,625 + 1,953,125 = 2,441,406
 *
 * Placement Rules:
 * 1. New distributors are placed under their sponsor
 * 2. If sponsor's first level is full (5 positions), spill to next available position
 * 3. Breadth-first traversal ensures fair distribution
 * 4. Each position can have up to 5 direct children
 */

import { db } from '@/lib/db'
import { matrixPositions } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'

const MATRIX_WIDTH = 5 // 5 positions per level
const MATRIX_DEPTH = 9 // 9 levels deep

export interface MatrixPosition {
  id: string
  userId: string
  sponsorId: string
  level: number
  position: number
  parentId: string | null
  legPosition: number | null
}

export interface PlacementResult {
  success: boolean
  position?: MatrixPosition
  error?: string
}

/**
 * Find the next available position in the matrix for a new distributor
 * Uses breadth-first traversal to ensure even distribution
 */
export async function findNextAvailablePosition(
  sponsorId: string
): Promise<{ parentId: string; level: number; position: number; legPosition: number } | null> {
  // Start with the sponsor as the root
  let currentLevel = 1
  let queue: Array<{ userId: string; level: number }> = [{ userId: sponsorId, level: 1 }]

  while (queue.length > 0 && currentLevel <= MATRIX_DEPTH) {
    const current = queue.shift()
    if (!current) break

    // Check how many children this position has
    const children = await db
      .select()
      .from(matrixPositions)
      .where(
        and(
          eq(matrixPositions.parentId, current.userId),
          eq(matrixPositions.level, current.level + 1)
        )
      )
      .orderBy(matrixPositions.legPosition)

    // If this position has room for more children (< 5)
    if (children.length < MATRIX_WIDTH) {
      const nextLegPosition = children.length + 1
      const nextPosition = await getNextPositionNumber(current.level + 1)

      return {
        parentId: current.userId,
        level: current.level + 1,
        position: nextPosition,
        legPosition: nextLegPosition,
      }
    }

    // Add all children to queue for breadth-first traversal
    for (const child of children) {
      if (current.level + 1 < MATRIX_DEPTH) {
        queue.push({ userId: child.userId, level: current.level + 1 })
      }
    }

    currentLevel = current.level + 1
  }

  // Matrix is full (all 2,441,406 positions filled)
  return null
}

/**
 * Get the next sequential position number for a given level
 */
async function getNextPositionNumber(level: number): Promise<number> {
  const result = await db
    .select({ maxPosition: sql<number>`MAX(${matrixPositions.position})` })
    .from(matrixPositions)
    .where(eq(matrixPositions.level, level))

  const maxPosition = result[0]?.maxPosition || 0
  return maxPosition + 1
}

/**
 * Place a new distributor in the matrix
 */
export async function placeInMatrix(
  userId: string,
  sponsorId: string,
  placedBy: string
): Promise<PlacementResult> {
  try {
    // Check if user already has a matrix position
    const existingPosition = await db
      .select()
      .from(matrixPositions)
      .where(eq(matrixPositions.userId, userId))
      .limit(1)

    if (existingPosition.length > 0) {
      return {
        success: false,
        error: 'User already has a matrix position',
      }
    }

    // Special case: First position (sponsor at level 1)
    const sponsorPosition = await db
      .select()
      .from(matrixPositions)
      .where(eq(matrixPositions.userId, sponsorId))
      .limit(1)

    // If sponsor doesn't have a position yet, they get level 1, position 1
    if (sponsorPosition.length === 0) {
      const [newPosition] = await db
        .insert(matrixPositions)
        .values({
          userId: sponsorId,
          sponsorId: sponsorId, // Self-sponsored for root
          level: 1,
          position: 1,
          parentId: null,
          legPosition: null,
          status: 'active',
          placedBy: sponsorId,
        })
        .returning()

      return {
        success: true,
        position: {
          id: newPosition.id,
          userId: newPosition.userId,
          sponsorId: newPosition.sponsorId,
          level: newPosition.level,
          position: newPosition.position,
          parentId: newPosition.parentId,
          legPosition: newPosition.legPosition,
        },
      }
    }

    // Find next available position using breadth-first search
    const nextPos = await findNextAvailablePosition(sponsorId)

    if (!nextPos) {
      return {
        success: false,
        error: 'Matrix is full - no available positions',
      }
    }

    // Create the new matrix position
    const [newPosition] = await db
      .insert(matrixPositions)
      .values({
        userId,
        sponsorId,
        level: nextPos.level,
        position: nextPos.position,
        parentId: nextPos.parentId,
        legPosition: nextPos.legPosition,
        status: 'active',
        placedBy,
      })
      .returning()

    return {
      success: true,
      position: {
        id: newPosition.id,
        userId: newPosition.userId,
        sponsorId: newPosition.sponsorId,
        level: newPosition.level,
        position: newPosition.position,
        parentId: newPosition.parentId,
        legPosition: newPosition.legPosition,
      },
    }
  } catch (error) {
    console.error('Error placing in matrix:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during placement',
    }
  }
}

/**
 * Get all positions in a user's downline (for commission calculations)
 */
export async function getDownlinePositions(
  userId: string,
  maxLevels: number = 9
): Promise<MatrixPosition[]> {
  const positions: MatrixPosition[] = []
  const userPosition = await db
    .select()
    .from(matrixPositions)
    .where(eq(matrixPositions.userId, userId))
    .limit(1)

  if (userPosition.length === 0) {
    return positions
  }

  // Get all positions where this user is in the upline
  // This is a recursive query that would need to be optimized in production
  let queue = [userId]

  for (let i = 0; i < maxLevels && queue.length > 0; i++) {
    const currentQueue = [...queue]
    queue = []

    for (const parentId of currentQueue) {
      const children = await db
        .select()
        .from(matrixPositions)
        .where(eq(matrixPositions.parentId, parentId))

      for (const child of children) {
        positions.push({
          id: child.id,
          userId: child.userId,
          sponsorId: child.sponsorId,
          level: child.level,
          position: child.position,
          parentId: child.parentId,
          legPosition: child.legPosition,
        })
        queue.push(child.userId)
      }
    }
  }

  return positions
}

/**
 * Get upline positions (for matching bonuses)
 */
export async function getUplinePositions(
  userId: string,
  levels: number = 5
): Promise<MatrixPosition[]> {
  const upline: MatrixPosition[] = []
  let currentUserId: string | null = userId

  for (let i = 0; i < levels; i++) {
    if (!currentUserId) break

    const position = await db
      .select()
      .from(matrixPositions)
      .where(eq(matrixPositions.userId, currentUserId))
      .limit(1)

    if (position.length === 0 || !position[0].parentId) break

    const parentPosition = await db
      .select()
      .from(matrixPositions)
      .where(eq(matrixPositions.userId, position[0].parentId))
      .limit(1)

    if (parentPosition.length > 0) {
      upline.push({
        id: parentPosition[0].id,
        userId: parentPosition[0].userId,
        sponsorId: parentPosition[0].sponsorId,
        level: parentPosition[0].level,
        position: parentPosition[0].position,
        parentId: parentPosition[0].parentId,
        legPosition: parentPosition[0].legPosition,
      })
      currentUserId = parentPosition[0].userId
    } else {
      break
    }
  }

  return upline
}

/**
 * Count total positions in downline
 */
export async function countDownlinePositions(userId: string): Promise<number> {
  const positions = await getDownlinePositions(userId)
  return positions.length
}

/**
 * Get matrix stats for a user
 */
export async function getMatrixStats(userId: string) {
  const position = await db
    .select()
    .from(matrixPositions)
    .where(eq(matrixPositions.userId, userId))
    .limit(1)

  if (position.length === 0) {
    return null
  }

  const downline = await getDownlinePositions(userId)
  const directChildren = await db
    .select()
    .from(matrixPositions)
    .where(eq(matrixPositions.parentId, userId))

  return {
    level: position[0].level,
    position: position[0].position,
    legPosition: position[0].legPosition,
    totalDownline: downline.length,
    directChildren: directChildren.length,
    availableSlots: MATRIX_WIDTH - directChildren.length,
  }
}
