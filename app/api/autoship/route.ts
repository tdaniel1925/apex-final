import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { autoshipSubscriptions, autoshipExecutions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch autoship subscriptions for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const subscriptionId = searchParams.get('subscriptionId')

    if (subscriptionId) {
      // Fetch specific subscription with execution history
      const [subscription] = await db
        .select()
        .from(autoshipSubscriptions)
        .where(eq(autoshipSubscriptions.id, subscriptionId))
        .limit(1)

      if (!subscription) {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
      }

      // Get execution history
      const executions = await db
        .select()
        .from(autoshipExecutions)
        .where(eq(autoshipExecutions.subscriptionId, subscriptionId))

      return NextResponse.json({ subscription, executions })
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Fetch all subscriptions for user
    const subscriptions = await db
      .select()
      .from(autoshipSubscriptions)
      .where(eq(autoshipSubscriptions.userId, userId))

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching autoship subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// POST - Create new autoship subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      name,
      frequency,
      dayOfMonth,
      dayOfWeek,
      products,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethodId,
      shippingAddress,
      nextRunDate,
    } = body

    if (!userId || !name || !frequency || !products || !total || !shippingAddress || !nextRunDate) {
      return NextResponse.json(
        {
          error:
            'Required fields: userId, name, frequency, products, total, shippingAddress, nextRunDate',
        },
        { status: 400 }
      )
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Products must be a non-empty array' },
        { status: 400 }
      )
    }

    // Create subscription
    const [newSubscription] = await db
      .insert(autoshipSubscriptions)
      .values({
        userId,
        name,
        status: 'active',
        frequency,
        dayOfMonth: dayOfMonth || null,
        dayOfWeek: dayOfWeek || null,
        products,
        subtotal,
        tax: tax || '0.00',
        shipping: shipping || '0.00',
        total,
        paymentMethodId: paymentMethodId || null,
        shippingAddress,
        nextRunDate: new Date(nextRunDate),
        lastRunDate: null,
        failedAttempts: '0',
        lastFailureReason: null,
      })
      .returning()

    return NextResponse.json(newSubscription, { status: 201 })
  } catch (error) {
    console.error('Error creating autoship subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

// PUT - Update autoship subscription
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriptionId, ...updates } = body

    if (!subscriptionId) {
      return NextResponse.json({ error: 'subscriptionId is required' }, { status: 400 })
    }

    // Convert nextRunDate to Date if provided
    if (updates.nextRunDate) {
      updates.nextRunDate = new Date(updates.nextRunDate)
    }

    // Handle cancellation
    if (updates.status === 'cancelled' && !updates.cancelledAt) {
      updates.cancelledAt = new Date()
    }

    const [updatedSubscription] = await db
      .update(autoshipSubscriptions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(autoshipSubscriptions.id, subscriptionId))
      .returning()

    if (!updatedSubscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error('Error updating autoship subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// DELETE - Delete autoship subscription
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subscriptionId = searchParams.get('subscriptionId')

    if (!subscriptionId) {
      return NextResponse.json({ error: 'subscriptionId is required' }, { status: 400 })
    }

    // Delete execution history first
    await db.delete(autoshipExecutions).where(eq(autoshipExecutions.subscriptionId, subscriptionId))

    // Delete subscription
    await db.delete(autoshipSubscriptions).where(eq(autoshipSubscriptions.id, subscriptionId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting autoship subscription:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    )
  }
}
