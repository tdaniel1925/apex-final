import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { constructWebhookEvent } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { orders, orderItems, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { processOrderCommissions } from '@/lib/mlm/commission-calculator'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  try {
    // Verify webhook signature
    const event = constructWebhookEvent(body, signature)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing checkout session:', session.id)

    // Get metadata
    const distributorId = session.metadata?.distributor_id
    // const distributorUsername = session.metadata?.distributor_username // Reserved for future use

    if (!distributorId) {
      throw new Error('No distributor ID in session metadata')
    }

    // Get distributor
    const [distributor] = await db
      .select()
      .from(users)
      .where(eq(users.id, distributorId))
      .limit(1)

    if (!distributor) {
      throw new Error(`Distributor not found: ${distributorId}`)
    }

    // Get line items from Stripe
    const stripe = require('@/lib/stripe/server').stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    })

    // Calculate totals
    const subtotal = (session.amount_subtotal || 0) / 100
    const tax = (session.amount_total || 0) / 100 - subtotal
    const total = (session.amount_total || 0) / 100

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: distributorId, // Customer ID (for now using distributor)
        distributorId,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: '0',
        total: total.toString(),
        status: 'processing',
        paymentStatus: 'paid',
        stripePaymentIntentId: session.payment_intent as string,
        shippingAddress: JSON.stringify(session.shipping_details),
        customerNotes: session.customer_email || '',
      })
      .returning()

    // Create order items
    for (const item of lineItems.data) {
      const price = (item.price?.unit_amount || 0) / 100
      const quantity = item.quantity || 1

      await db.insert(orderItems).values({
        orderId: order.id,
        productId: distributorId, // Placeholder - should be actual product ID
        quantity,
        price: price.toString(),
        commissionableValue: (price * 0.75).toString(), // 75% of price is commissionable
      })
    }

    console.log(`Order created successfully: ${orderNumber}`)

    // Calculate and create commissions
    const commissionResult = await processOrderCommissions(order.id, distributorId)

    if (commissionResult.success) {
      console.log(
        `Commissions created: ${commissionResult.commissionsCreated}, ` +
        `Total amount: $${commissionResult.totalAmount.toFixed(2)}`
      )
    } else {
      console.error(`Failed to process commissions: ${commissionResult.error}`)
    }

    // TODO: Send order confirmation email

    return order
  } catch (error) {
    console.error('Error processing checkout session:', error)
    throw error
  }
}
