import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { commissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'

    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Fetch commissions with user details
    let query = db
      .select({
        id: commissions.id,
        userId: commissions.userId,
        fromUserId: commissions.fromUserId,
        orderId: commissions.orderId,
        amount: commissions.amount,
        commissionType: commissions.type,
        level: commissions.level,
        status: commissions.status,
        calculatedAt: commissions.createdAt,
        paidAt: commissions.paidAt,
      })
      .from(commissions)

    if (status !== 'all') {
      query = query.where(eq(commissions.status, status)) as any
    }

    const results = await query

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching commissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { commissionId, status } = await request.json()

    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Validate input
    if (!commissionId || !status) {
      return NextResponse.json(
        { error: 'Commission ID and status are required' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected', 'pending', 'paid'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update the commission
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (status === 'paid') {
      updateData.paidAt = new Date()
    }

    const [updatedCommission] = await db
      .update(commissions)
      .set(updateData)
      .where(eq(commissions.id, commissionId))
      .returning()

    if (!updatedCommission) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: `Commission ${status} successfully`,
      commission: updatedCommission,
    })
  } catch (error) {
    console.error('Error updating commission:', error)
    return NextResponse.json(
      { error: 'Failed to update commission' },
      { status: 500 }
    )
  }
}
