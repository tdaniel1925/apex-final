import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.warn('Stripe secret key not configured')
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
  typescript: true,
})

/**
 * Create a Stripe Checkout Session for product purchases
 */
export async function createCheckoutSession(params: {
  customerId?: string
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    line_items: params.lineItems,
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    payment_intent_data: {
      metadata: params.metadata,
    },
  })

  return session
}

/**
 * Create a Stripe Connect account for payouts
 */
export async function createConnectAccount(params: {
  email: string
  userId: string
  firstName: string
  lastName: string
}) {
  const account = await stripe.accounts.create({
    type: 'express',
    email: params.email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: {
      user_id: params.userId,
    },
    business_profile: {
      name: `${params.firstName} ${params.lastName}`,
    },
  })

  return account
}

/**
 * Create an account link for Stripe Connect onboarding
 */
export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })

  return accountLink
}

/**
 * Create a transfer to a Connect account
 */
export async function createTransfer(params: {
  amount: number // in cents
  currency: string
  destination: string // Connect account ID
  metadata?: Record<string, string>
}) {
  const transfer = await stripe.transfers.create({
    amount: params.amount,
    currency: params.currency,
    destination: params.destination,
    metadata: params.metadata,
  })

  return transfer
}

/**
 * Get Stripe customer by ID
 */
export async function getCustomer(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId)
  return customer
}

/**
 * Create a Stripe customer
 */
export async function createCustomer(params: {
  email: string
  name: string
  metadata?: Record<string, string>
}) {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  })

  return customer
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
