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
        { error: 'No Connect account found' },
        { status: 400 }
      )
    }

    // Create login link to Stripe Express Dashboard
    const loginLink = await stripe.accounts.createLoginLink(user.stripeConnectAccountId)

    return NextResponse.json({
      url: loginLink.url,
    })
  } catch (error) {
    console.error('Error creating dashboard link:', error)
    return NextResponse.json(
      { error: 'Failed to create dashboard link' },
      { status: 500 }
    )
  }
}
