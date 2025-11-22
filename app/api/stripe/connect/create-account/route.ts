import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(_request: NextRequest) {
  try {
    // TODO: Add proper authentication with Supabase Auth
    // For now, using test user for development
    const testUserId = '00000000-0000-0000-0000-000000000001'

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already has a Connect account
    if (user.stripeConnectAccountId) {
      // Retrieve existing account
      const account = await stripe.accounts.retrieve(user.stripeConnectAccountId)

      return NextResponse.json({
        accountId: account.id,
        detailsSubmitted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
      })
    }

    // Create new Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        user_id: user.id,
        username: user.replicatedSiteUrl || '',
      },
    })

    // Update user with Connect account ID
    await db
      .update(users)
      .set({ stripeConnectAccountId: account.id })
      .where(eq(users.id, user.id))

    return NextResponse.json({
      accountId: account.id,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    })
  } catch (error) {
    console.error('Error creating Connect account:', error)
    return NextResponse.json(
      { error: 'Failed to create Connect account' },
      { status: 500 }
    )
  }
}
