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

    if (!user.stripeConnectAccountId) {
      return NextResponse.json(
        { error: 'No Connect account found. Please create an account first.' },
        { status: 400 }
      )
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeConnectAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=payouts&refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=payouts&success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({
      url: accountLink.url,
    })
  } catch (error) {
    console.error('Error creating onboarding link:', error)
    return NextResponse.json(
      { error: 'Failed to create onboarding link' },
      { status: 500 }
    )
  }
}
