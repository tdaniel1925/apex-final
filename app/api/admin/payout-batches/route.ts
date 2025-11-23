import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { paymentBatches, commissions } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'

export async function GET() {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Fetch all payout batches
    const batches = await db.select().from(paymentBatches).orderBy(paymentBatches.createdAt)

    return NextResponse.json(batches)
  } catch (error) {
    console.error('Error fetching payout batches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payout batches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { batchName, commissionIds } = await request.json()

    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Validate input
    if (!batchName) {
      return NextResponse.json({ error: 'Batch name is required' }, { status: 400 })
    }

    // Get commissions to include in batch
    let commissionsToInclude
    if (commissionIds && commissionIds.length > 0) {
      commissionsToInclude = await db
        .select()
        .from(commissions)
        .where(inArray(commissions.id, commissionIds))
    } else {
      // Include all approved commissions
      commissionsToInclude = await db
        .select()
        .from(commissions)
        .where(eq(commissions.status, 'approved'))
    }

    if (commissionsToInclude.length === 0) {
      return NextResponse.json(
        { error: 'No commissions available for payout' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = commissionsToInclude.reduce(
      (sum, comm) => sum + parseFloat(comm.amount),
      0
    )

    // Create payout batch
    const [batch] = await db
      .insert(paymentBatches)
      .values({
        name: batchName,
        totalAmount: totalAmount.toString(),
        paymentCount: commissionsToInclude.length,
        status: 'pending',
        createdAt: new Date(),
      })
      .returning()

    // Update commissions to include batch reference
    // Note: This would require adding a batchId field to the commissions table
    // For now, we'll just update the status
    await db
      .update(commissions)
      .set({ status: 'approved' })
      .where(
        inArray(
          commissions.id,
          commissionsToInclude.map((c) => c.id)
        )
      )

    return NextResponse.json({
      message: 'Payout batch created successfully',
      batch,
    })
  } catch (error) {
    console.error('Error creating payout batch:', error)
    return NextResponse.json(
      { error: 'Failed to create payout batch' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { batchId, action } = await request.json()

    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Validate input
    if (!batchId || !action) {
      return NextResponse.json(
        { error: 'Batch ID and action are required' },
        { status: 400 }
      )
    }

    if (action !== 'process') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get batch details
    const [batch] = await db
      .select()
      .from(paymentBatches)
      .where(eq(paymentBatches.id, batchId))

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
    }

    if (batch.status !== 'pending') {
      return NextResponse.json(
        { error: 'Batch has already been processed' },
        { status: 400 }
      )
    }

    // Update batch status
    const [updatedBatch] = await db
      .update(paymentBatches)
      .set({
        status: 'processing',
        processedAt: new Date(),
        // processedBy: session.user.id
      })
      .where(eq(paymentBatches.id, batchId))
      .returning()

    // TODO: Integrate with payment processor
    // TODO: Update individual commission statuses to 'paid'
    // TODO: Create payment records

    return NextResponse.json({
      message: 'Payout batch processing started',
      batch: updatedBatch,
    })
  } catch (error) {
    console.error('Error processing payout batch:', error)
    return NextResponse.json(
      { error: 'Failed to process payout batch' },
      { status: 500 }
    )
  }
}
