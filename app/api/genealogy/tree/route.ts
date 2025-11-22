import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, matrixPositions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getPersonalSales, getTeamVolume, getActiveLegs } from '@/lib/mlm/rank-system'

interface TreeNode {
  id: string
  name: string
  email: string
  rank: string
  level: number
  position: number
  legPosition: number
  children: TreeNode[]
  personalSales: number
  teamVolume: number
  activeLegs: number
  status: 'active' | 'inactive'
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const levels = parseInt(searchParams.get('levels') || '3')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Get user's matrix position
    const [userPosition] = await db
      .select()
      .from(matrixPositions)
      .where(eq(matrixPositions.userId, userId))
      .limit(1)

    if (!userPosition) {
      return NextResponse.json({ error: 'User not found in matrix' }, { status: 404 })
    }

    // Build tree recursively
    const treeData = await buildTreeNode(userId, userPosition.level, levels)

    return NextResponse.json(treeData)
  } catch (error) {
    console.error('Error fetching genealogy tree:', error)
    return NextResponse.json(
      { error: 'Failed to fetch genealogy tree' },
      { status: 500 }
    )
  }
}

async function buildTreeNode(
  userId: string,
  currentLevel: number,
  maxLevels: number
): Promise<TreeNode | null> {
  // Get user data
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    return null
  }

  // Get matrix position
  const [position] = await db
    .select()
    .from(matrixPositions)
    .where(eq(matrixPositions.userId, userId))
    .limit(1)

  // Get stats
  const [personalSales, teamVolume, activeLegs] = await Promise.all([
    getPersonalSales(userId),
    getTeamVolume(userId),
    getActiveLegs(userId),
  ])

  const node: TreeNode = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    rank: user.rankId || 'distributor',
    level: position?.level || 1,
    position: position?.position || 1,
    legPosition: position?.legPosition || 1,
    personalSales,
    teamVolume,
    activeLegs,
    status: user.status === 'active' ? 'active' : 'inactive',
    children: [],
  }

  // If we haven't reached max depth, get children
  if (currentLevel < maxLevels) {
    // Get direct children (next level in matrix)
    const children = await db
      .select()
      .from(matrixPositions)
      .where(eq(matrixPositions.parentId, userId))

    // Build child nodes recursively
    for (const child of children) {
      const childNode = await buildTreeNode(child.userId, currentLevel + 1, maxLevels)
      if (childNode) {
        node.children.push(childNode)
      }
    }

    // Sort children by leg position
    node.children.sort((a, b) => a.legPosition - b.legPosition)
  }

  return node
}
