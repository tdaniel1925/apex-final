import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, createCustomer } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItems, distributorUsername, customerEmail, customerName } = body

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Get distributor info
    const [distributor] = await db
      .select()
      .from(users)
      .where(eq(users.replicatedSiteUrl, distributorUsername))
      .limit(1)

    if (!distributor) {
      return NextResponse.json(
        { error: 'Distributor not found' },
        { status: 404 }
      )
    }

    // Create or get Stripe customer
    let stripeCustomerId = distributor.stripeCustomerId

    if (!stripeCustomerId && customerEmail && customerName) {
      const customer = await createCustomer({
        email: customerEmail,
        name: customerName,
        metadata: {
          distributor_id: distributor.id,
        },
      })
      stripeCustomerId = customer.id

      // Update user with Stripe customer ID
      await db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, distributor.id))
    }

    // Convert cart items to Stripe line items
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: stripeCustomerId || undefined,
      lineItems,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${distributorUsername}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${distributorUsername}/checkout/cancel`,
      metadata: {
        distributor_id: distributor.id,
        distributor_username: distributorUsername,
        customer_email: customerEmail || '',
        customer_name: customerName || '',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
