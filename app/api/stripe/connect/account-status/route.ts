import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_request: NextRequest) {
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

    // If no Connect account, return null status
    if (!user.stripeConnectAccountId) {
      return NextResponse.json({
        hasAccount: false,
        accountId: null,
        detailsSubmitted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        requiresAction: false,
        requirements: null,
      })
    }

    // Retrieve account from Stripe
    const account = await stripe.accounts.retrieve(user.stripeConnectAccountId)

    // Check if there are any requirements
    const requiresAction =
      (account.requirements?.currently_due && account.requirements.currently_due.length > 0) ||
      (account.requirements?.eventually_due && account.requirements.eventually_due.length > 0) ||
      (account.requirements?.past_due && account.requirements.past_due.length > 0)

    return NextResponse.json({
      hasAccount: true,
      accountId: account.id,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requiresAction,
      requirements: {
        currentlyDue: account.requirements?.currently_due || [],
        eventuallyDue: account.requirements?.eventually_due || [],
        pastDue: account.requirements?.past_due || [],
        disabled_reason: account.requirements?.disabled_reason || null,
      },
      email: account.email,
      businessType: account.business_type,
      country: account.country,
    })
  } catch (error) {
    console.error('Error fetching account status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account status' },
      { status: 500 }
    )
  }
}
